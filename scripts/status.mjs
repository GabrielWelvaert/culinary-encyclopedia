// Reports whether each part of the local dev environment is running.
// Usage: npm run status
import net from "node:net";
import path from "node:path";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const composeFile = path.join(root, "docker", "compose.yaml");

const WEB_URL = "http://localhost:5173";
const API_HOST = "127.0.0.1";
const API_PORT = 3000;
const E2E_URL = `http://${API_HOST}:${API_PORT}/recipes`;

function portOpen(host, port, timeoutMs = 1000) {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port });
    const done = (ok) => {
      socket.destroy();
      resolve(ok);
    };
    socket.setTimeout(timeoutMs, () => done(false));
    socket.once("connect", () => done(true));
    socket.once("error", () => done(false));
  });
}

async function httpStatus(url, timeoutMs) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    return res.status;
  } catch (err) {
    return err.name === "TimeoutError" ? "timeout" : "unreachable";
  }
}

function postgresReady() {
  return new Promise((resolve) => {
    execFile(
      "docker",
      ["compose", "-f", composeFile, "exec", "-T", "postgres", "pg_isready"],
      { timeout: 10000 },
      (err, _stdout, stderr) => {
        if (!err) return resolve({ ok: true, detail: "accepting connections on :5432" });
        if (err.code === "ENOENT") return resolve({ ok: false, detail: "docker not installed" });
        if (/docker API|daemon/i.test(stderr)) return resolve({ ok: false, detail: "Docker Desktop not running" });
        if (/not running|no such service/i.test(stderr)) return resolve({ ok: false, detail: "container not running (npm run db:up)" });
        resolve({ ok: false, detail: stderr.trim().split("\n")[0] || "not ready" });
      },
    );
  });
}

async function checkWeb() {
  const status = await httpStatus(WEB_URL, 2000);
  return status === 200
    ? { ok: true, detail: WEB_URL }
    : { ok: false, detail: `${status} (npm run web)` };
}

async function checkApi() {
  return (await portOpen(API_HOST, API_PORT))
    ? { ok: true, detail: `http://${API_HOST}:${API_PORT}` }
    : { ok: false, detail: "port 3000 closed (npm run api)" };
}

async function checkE2e(apiUp) {
  if (!apiUp) return { ok: false, detail: "skipped (api down)" };
  // First call after `sam local start-api` starts a Lambda container, so allow time.
  const status = await httpStatus(E2E_URL, 15000);
  return status === 200
    ? { ok: true, detail: `GET /recipes ${status}` }
    : { ok: false, detail: `GET /recipes ${status} (see npm run api terminal)` };
}

const [web, api, db] = await Promise.all([checkWeb(), checkApi(), postgresReady()]);
const e2e = await checkE2e(api.ok);

const rows = { web, api, db, e2e };
for (const [name, { ok, detail }] of Object.entries(rows)) {
  console.log(`${name.padEnd(5)} ${ok ? "✓ up  " : "✗ down"}  ${detail}`);
}

process.exitCode = Object.values(rows).every((r) => r.ok) ? 0 : 1;
