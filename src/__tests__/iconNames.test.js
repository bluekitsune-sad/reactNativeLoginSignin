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

const sourceFiles = () => {
  const root = path.join(__dirname, "..", "..");
  return { root, files: [...walk(path.join(root, "src")), path.join(root, "App.js")] };
};

const collectIconNameLiterals = () => {
  const { root, files } = sourceFiles();
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

/**
 * Data-driven icon strings the JSX-literal pattern cannot see: icon props
 * holding name strings (CapabilityMeta, homeContent, LIST_KIND_META,
 * ledger/row/outcome maps), icon-name maps (`POI_ICONS`, `EVENT_ICONS`,
 * the tab `icons` map) and their nullish-coalescing default names.
 */
const collectDataIconNames = () => {
  const { root, files } = sourceFiles();
  const entries = [];
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const relative = path.relative(root, file);
    const add = (index, name) => {
      entries.push({ file: relative, line: text.slice(0, index).split("\n").length, name });
    };

    let match;
    const iconProp = /\bicon:\s*["']([^"']+)["']/g;
    while ((match = iconProp.exec(text))) {
      add(match.index, match[1]);
    }

    const iconMap = /\b(?:const|let|var)\s+\w*icons\b\s*=\s*\{/gi;
    while ((match = iconMap.exec(text))) {
      const blockStart = match.index + match[0].length - 1;
      let depth = 0;
      let blockEnd = blockStart;
      for (let i = blockStart; i < text.length; i += 1) {
        if (text[i] === "{") {
          depth += 1;
        } else if (text[i] === "}") {
          depth -= 1;
          if (depth === 0) {
            blockEnd = i;
            break;
          }
        }
      }
      const block = text.slice(blockStart, blockEnd + 1);
      const value = /:\s*["']([^"']+)["']/g;
      let valued;
      while ((valued = value.exec(block))) {
        add(blockStart + valued.index, valued[1]);
      }
    }

    const fallback = /\b\w*ICONS\[[^\]]*\]\s*\?\?\s*["']([^"']+)["']/g;
    while ((match = fallback.exec(text))) {
      add(match.index, match[1]);
    }
  }
  return entries;
};

describe("vector-icon name literals", () => {
  it("every Ionicons/Feather name in the codebase exists in the packaged glyphmap", () => {
    const literals = collectIconNameLiterals();
    expect(literals.length).toBeGreaterThan(0);
    const invalid = literals.filter((entry) => !(entry.name in glyphmaps[entry.component]));
    expect(invalid.map((e) => `${e.file}:${e.line} <${e.component} name="${e.name}">`)).toEqual([]);
  });
});

describe("data-driven vector-icon names", () => {
  it("every icon string held in data maps/props exists in the Ionicons glyphmap", () => {
    const entries = collectDataIconNames();
    expect(entries.length).toBeGreaterThan(0);
    const invalid = entries.filter((entry) => !(entry.name in glyphmaps.Ionicons));
    expect(invalid.map((e) => `${e.file}:${e.line} ${e.name}`)).toEqual([]);
  });
});
