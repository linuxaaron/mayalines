import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const port = 3100;
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", String(port)], {
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
  stdio: ["ignore", "pipe", "pipe"],
});

let output = "";
server.stdout.on("data", (chunk) => (output += chunk));
server.stderr.on("data", (chunk) => (output += chunk));

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Production server did not become ready.\n${output}`);
}

async function get(pathname) {
  const response = await fetch(`${baseUrl}${pathname}`);
  assert.equal(response.status, 200, `${pathname} should return 200`);
  return { response, text: await response.text() };
}

async function assertClientChunksStaySmall(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await assertClientChunksStaySmall(target);
    if (entry.isFile() && entry.name.endsWith(".js")) {
      const bytes = (await stat(target)).size;
      assert.ok(bytes < 5_000_000, `${target} is ${(bytes / 1_000_000).toFixed(2)} MB; quote data leaked into a client chunk`);
    }
  }
}

try {
  await waitForServer();

  const home = await get("/");
  assert.equal((home.text.match(/<footer/g) || []).length, 1, "homepage should render exactly one footer");
  assert.match(home.response.headers.get("strict-transport-security") || "", /max-age=31536000/);
  assert.match(home.response.headers.get("content-security-policy") || "", /frame-ancestors 'none'/);

  await Promise.all(["/random", "/library", "/submit", "/opengraph-image"].map(get));

  const [robots, primarySitemap, overflowSitemap] = await Promise.all([
    get("/robots.txt"),
    get("/sitemap.xml"),
    get("/sitemap-quotes-2.xml"),
  ]);
  assert.match(robots.text, /Sitemap: .*\/sitemap-quotes-2\.xml/, "robots.txt should advertise the overflow sitemap");
  const sitemapQuoteCount = (primarySitemap.text.match(/<loc>[^<]*\/quotes\//g) || []).length
    + (overflowSitemap.text.match(/<loc>[^<]*\/quotes\//g) || []).length;
  assert.ok(sitemapQuoteCount >= 49_000, `sitemaps should expose at least 49,000 quote URLs, found ${sitemapQuoteCount}`);

  const formerlyPendingQuote = await get("/quotes/creativity-is-the-key-to-success-in-the-future-and-primary-education-is-where-teachers-c-q00043");
  assert.match(formerlyPendingQuote.text, /<meta name="robots" content="index, follow"/i, "rights-cleared quote pages should be indexable");

  const randomResponse = await fetch(`${baseUrl}/api/quotes/random`);
  assert.equal(randomResponse.status, 200);
  const randomPayload = await randomResponse.json();
  assert.equal(typeof randomPayload.quote?.quote, "string");
  assert.equal(typeof randomPayload.quote?.author, "string");

  const libraryResponse = await fetch(`${baseUrl}/api/library?limit=1`);
  assert.equal(libraryResponse.status, 200);
  const libraryPayload = await libraryResponse.json();
  assert.ok(libraryPayload.total >= 49_000, `public library should expose at least 49,000 quotes, found ${libraryPayload.total}`);

  const blockedMutation = await fetch(`${baseUrl}/api/quotes/test/copy`, {
    method: "POST",
    headers: { "Sec-Fetch-Site": "cross-site" },
  });
  assert.equal(blockedMutation.status, 403, "cross-site mutations should be rejected before data access");

  await assertClientChunksStaySmall(path.join(process.cwd(), ".next", "static", "chunks"));
  console.log("Smoke tests passed: 49,000+ indexed quotes, routes, headers, CSRF guard, footer semantics and client bundle ceiling.");
} finally {
  server.kill("SIGTERM");
}
