#!/usr/bin/env node
/**
 * Capture screenshots of the MallMate web build into `output/screens/`.
 *
 * Pipeline (local, no extra npm dependencies):
 *   1. `expo export:web` (webpack, matches webpack.config.js) bundles the
 *      app into `web-build/` (skippable with `--skip-export` if the build
 *      is already fresh).
 *   2. A tiny static server serves `web-build/` with an SPA fallback so
 *      deep-link URLs (`/Main/Home`, `/MerchantDetail?merchantId=…`) load.
 *   3. Headless Chrome/Chromium (`--headless --screenshot`) opens each
 *      screen URL — the navigator enables web deep linking for this — and
 *      writes a PNG per screen.
 *
 * Chrome binary resolution order: $CHROME_PATH, google-chrome-stable,
 * google-chrome, chromium, chromium-browser (first that responds to
 * `--version`). Fails the run with a non-zero exit code if any capture
 * is missing or suspiciously small.
 *
 * Usage:
 *   node scripts/capture-screens.mjs [--skip-export] [--out DIR] [--port N]
 *                                    [--only name[,name…]]
 */

import { spawn, spawnSync } from "node:child_process";
import { createReadStream, existsSync, mkdirSync, statSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WEB_BUILD = path.join(ROOT, "web-build");
const VIEWPORT = { width: 390, height: 844 };
const VIRTUAL_TIME_BUDGET_MS = 20000;
const MIN_PNG_BYTES = 5 * 1024;

/**
 * Screens to capture: name → deep-link path. Mock data drives most of the
 * app, so ids are stable fixtures from `src/mock/`. The tab bar, merchant
 * and offer screens are the core set called out in TODO.md.
 */
const SCREENS = [
  { name: "signin", path: "/Signin" },
  { name: "register-phone", path: "/RegisterPhone" },
  { name: "country-code", path: "/CountryCode" },
  {
    name: "verification",
    path: "/Verification?dialCode=%2B92&phone=3001234567",
  },
  { name: "home", path: "/Main/Home" },
  { name: "explore", path: "/Main/Explore" },
  { name: "map-tab", path: "/Main/Map" },
  { name: "rewards", path: "/Main/Rewards" },
  { name: "profile", path: "/Main/Profile" },
  { name: "mall-selector", path: "/MallSelector" },
  { name: "search", path: "/Search?q=pizza" },
  { name: "restaurant-list", path: "/RestaurantList?kind=restaurants" },
  { name: "merchant-detail", path: "/MerchantDetail?merchantId=lucky-m-1" },
  { name: "menu", path: "/Menu?merchantId=lucky-m-1" },
  { name: "menu-item", path: "/MenuItem?merchantId=lucky-m-1&itemId=lucky-m-1-i1" },
  { name: "offer-detail", path: "/OfferDetail?offerId=lucky-discount-1" },
  { name: "favorites", path: "/Favorites" },
  { name: "events", path: "/Events" },
  { name: "event-detail", path: "/EventDetail?eventId=lucky-event-1" },
  { name: "food-court", path: "/FoodCourt" },
  { name: "seat-scan", path: "/SeatScan" },
  { name: "floor-map", path: "/FloorMap" },
  { name: "destination-search", path: "/DestinationSearch" },
  { name: "destination-detail", path: "/DestinationDetail?destinationId=lz-2-foodcourt" },
  {
    name: "start-point-select",
    path: "/StartPointSelect?destinationId=lz-2-foodcourt",
  },
  {
    name: "route-preview",
    path: "/RoutePreview?destinationId=lz-2-foodcourt&startId=lz-g-entrance",
  },
  { name: "order-history", path: "/OrderHistory" },
  { name: "order-detail", path: "/OrderDetail?orderId=mm-order-1042" },
  { name: "settings", path: "/Settings" },
];

const MIME = {
  ".css": "text/css",
  ".gif": "image/gif",
  ".html": "text/html",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".json": "application/json",
  ".map": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".txt": "text/plain",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function parseArgs(argv) {
  const args = { skipExport: false, out: "output/screens", port: 4311, only: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--skip-export") args.skipExport = true;
    else if (arg === "--out") args.out = argv[++i];
    else if (arg === "--port") args.port = Number(argv[++i]);
    else if (arg === "--only") args.only = argv[++i].split(",").map((s) => s.trim());
    else {
      console.error(`Unknown argument: ${arg}`);
      process.exit(2);
    }
  }
  return args;
}

function run(command, commandArgs, label) {
  console.log(`\n> ${command} ${commandArgs.join(" ")}`);
  const result = spawnSync(command, commandArgs, { cwd: ROOT, stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status ?? "signal"}`);
  }
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "google-chrome-stable",
    "google-chrome",
    "chromium",
    "chromium-browser",
  ].filter(Boolean);
  for (const bin of candidates) {
    const probe = spawnSync(bin, ["--version"], { stdio: "ignore" });
    if (probe.status === 0) return bin;
  }
  throw new Error(
    "No Chrome/Chromium binary found. Set CHROME_PATH or install google-chrome/chromium.",
  );
}

function startStaticServer(rootDir, port) {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    let filePath = path.join(rootDir, urlPath);
    if (!filePath.startsWith(rootDir)) {
      res.writeHead(403).end();
      return;
    }
    if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
      filePath = path.join(rootDir, "index.html"); // SPA fallback
    }
    res.writeHead(200, {
      "content-type": MIME[path.extname(filePath)] || "application/octet-stream",
    });
    createReadStream(filePath).pipe(res);
  });
  return new Promise((resolve, reject) => {
    server.on("error", reject);
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

function capture(chromeBin, url, outFile) {
  return new Promise((resolve, reject) => {
    const args = [
      "--headless",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
      "--mute-audio",
      "--force-device-scale-factor=1",
      `--window-size=${VIEWPORT.width},${VIEWPORT.height}`,
      `--virtual-time-budget=${VIRTUAL_TIME_BUDGET_MS}`,
      `--screenshot=${outFile}`,
      url,
    ];
    const child = spawn(chromeBin, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`Timed out: ${url}`));
    }, VIRTUAL_TIME_BUDGET_MS + 15000);
    child.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (!existsSync(outFile)) {
        reject(new Error(`No screenshot written for ${url} (exit ${code}): ${stderr.slice(-500)}`));
        return;
      }
      resolve();
    });
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const outDir = path.resolve(ROOT, args.out);

  if (!args.skipExport || !existsSync(path.join(WEB_BUILD, "index.html"))) {
    run("npx", ["expo", "export:web"], "expo export:web");
  } else {
    console.log("\nSkipping export (--skip-export): reusing existing web-build/.");
  }
  if (!existsSync(path.join(WEB_BUILD, "index.html"))) {
    throw new Error(`Export finished but ${path.join(WEB_BUILD, "index.html")} is missing.`);
  }

  const chromeBin = findChrome();
  console.log(`\nUsing browser: ${chromeBin}`);

  mkdirSync(outDir, { recursive: true });
  const targets = args.only ? SCREENS.filter((screen) => args.only.includes(screen.name)) : SCREENS;
  if (!targets.length) throw new Error(`No matching screens for --only ${args.only}`);

  const server = await startStaticServer(WEB_BUILD, args.port);
  const base = `http://127.0.0.1:${args.port}`;
  const failures = [];
  let successes = 0;

  for (const screen of targets) {
    const outFile = path.join(outDir, `${screen.name}.png`);
    const url = `${base}${screen.path}`;
    try {
      await capture(chromeBin, url, outFile);
      const bytes = statSync(outFile).size;
      if (bytes < MIN_PNG_BYTES) {
        failures.push(`${screen.name}: screenshot only ${bytes} bytes`);
        console.log(`✗ ${screen.name} — suspiciously small (${bytes} B)`);
      } else {
        successes += 1;
        console.log(`✓ ${screen.name} — ${path.relative(ROOT, outFile)} (${bytes} B)`);
      }
    } catch (err) {
      failures.push(`${screen.name}: ${err.message}`);
      console.log(`✗ ${screen.name} — ${err.message}`);
    }
  }

  server.close();
  console.log(
    `\nCaptured ${successes}/${targets.length} screens into ${path.relative(ROOT, outDir)}/`,
  );
  if (failures.length) {
    console.error("Failures:");
    failures.forEach((failure) => console.error(`  - ${failure}`));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
