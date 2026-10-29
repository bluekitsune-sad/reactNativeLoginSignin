/* eslint-env node, jest */
const fs = require("fs");
const path = require("path");

const glyphmaps = {
  Ionicons: require("@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Ionicons.json"),
  Feather: require("@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Feather.json"),
};

const walk = (dir) => {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (/\.(js|jsx|ts|tsx|mjs)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
};

const collectIconNameLiterals = () => {
  const root = path.join(__dirname, "..", "..");
  const files = [...walk(path.join(root, "src")), path.join(root, "App.js")];
  const literals = [];
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const pattern = /<(Ionicons|Feather)\s[^>]*?name=["']([^"']+)["']/g;
    let match;
    while ((match = pattern.exec(text))) {
      const line = text.slice(0, match.index).split("\n").length;
      literals.push({ file: path.relative(root, file), line, component: match[1], name: match[2] });
    }
  }
  return literals;
};

describe("vector-icon name literals", () => {
  it("every Ionicons/Feather name in the codebase exists in the packaged glyphmap", () => {
    const literals = collectIconNameLiterals();
    expect(literals.length).toBeGreaterThan(0);
    const invalid = literals.filter((entry) => !(entry.name in glyphmaps[entry.component]));
    expect(invalid.map((e) => `${e.file}:${e.line} <${e.component} name="${e.name}">`)).toEqual([]);
  });
});
