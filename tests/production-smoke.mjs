import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import http from "node:http";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const port = 18731;
const server = spawn(process.execPath, ["node_modules/serve/build/main.js", "-s", "build", "-l", `tcp://127.0.0.1:${port}`, "--no-clipboard"], { stdio: "ignore" });
function request(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: "127.0.0.1", port, path, method: "GET", timeout: 1000 }, (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        body += chunk;
        if (body.length > 1000000) req.destroy(new Error("Response budget exceeded"));
      });
      response.on("end", () => resolve({ status: response.statusCode, body, contentType: response.headers["content-type"] }));
      response.on("error", reject);
    });
    req.on("timeout", () => req.destroy(new Error("Local server timeout")));
    req.on("error", reject);
    req.end();
  });
}
try {
  const expected = await readFile("build/index.html", "utf8");
  let page;
  for (let attempt = 0; attempt < 30; attempt++) {
    try { page = await request("/"); break; } catch { await delay(100); }
  }
  assert.equal(page?.status, 200);
  assert.equal(page.body, expected);
  assert.match(page.body, /<title>Simple Calculator<\/title>/);
  assert.match(page.body, /id="root"/);
  assert.doesNotMatch(page.body, /%PUBLIC_URL%/);
  const assets = [...page.body.matchAll(/(?:src|href)="([^" ]+)"/g)].map((match) => match[1]);
  assert.ok(assets.some((asset) => asset.startsWith("/assets/") && asset.endsWith(".js")));
  for (const asset of assets) {
    assert.match(asset, /^\/[a-zA-Z0-9_./-]+$/);
    const response = await request(asset);
    assert.equal(response.status, 200, `Missing asset ${asset}`);
    if (asset.endsWith(".js")) assert.match(response.contentType, /javascript/);
    if (asset.endsWith(".css")) assert.match(response.contentType, /css/);
    if (asset.endsWith(".json")) JSON.parse(response.body);
  }
  console.log(JSON.stringify({ productionServer: "passed", assets: assets.length, outputDirectory: "build" }));
} finally {
  server.kill("SIGTERM");
}
