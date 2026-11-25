// Stops a local dev server by the port it listens on.
//   npm run api:stop   stops the SAM API (:3000) and removes its Lambda containers
//   npm run web:stop   stops Vite (:5173)
// Add --dry-run to list what would be stopped without changing anything.
// Prefer Ctrl+C in the server's own terminal; this is for when that isn't available.
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

const TARGETS = {
  api: { port: 3000, removeSamContainers: true },
  web: { port: 5173, removeSamContainers: false },
};

const [name] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const dryRun = process.argv.includes("--dry-run");
const target = TARGETS[name];
if (!target) {
  console.error(`Usage: node scripts/stop.mjs <${Object.keys(TARGETS).join("|")}> [--dry-run]`);
  process.exit(2);
}

/** PIDs of processes listening on the given TCP port. */
async function listeningPids(port) {
  if (process.platform === "win32") {
    const { stdout } = await run("netstat", ["-ano", "-p", "TCP"]);
    const v6 = await run("netstat", ["-ano", "-p", "TCPv6"]).then((r) => r.stdout, () => "");
    const pids = new Set();
    for (const line of (stdout + v6).split(/\r?\n/)) {
      // Proto  Local Address  Foreign Address  State  PID
      const [proto, local, , state, pid] = line.trim().split(/\s+/);
      if (proto === "TCP" && state === "LISTENING" && local?.endsWith(`:${port}`)) {
        pids.add(Number(pid));
      }
    }
    return [...pids];
  }
  try {
    const { stdout } = await run("lsof", ["-t", "-sTCP:LISTEN", `-iTCP:${port}`]);
    return [...new Set(stdout.split("\n").filter(Boolean).map(Number))];
  } catch (err) {
    if (err.code === 1) return []; // lsof exits 1 when nothing matched
    throw err;
  }
}

async function samContainerIds() {
  const { stdout } = await run("docker", ["ps", "-aq", "--filter", "label=sam.cli.container.type=lambda"]);
  return stdout.split(/\r?\n/).filter(Boolean);
}

const pids = await listeningPids(target.port);
if (pids.length === 0) {
  console.log(`Nothing listening on :${target.port}`);
} else {
  console.log(`${dryRun ? "Would stop" : "Stopping"} PID ${pids.join(", ")} on :${target.port}`);
  if (!dryRun) {
    for (const pid of pids) {
      try {
        process.kill(pid);
      } catch (err) {
        if (err.code !== "ESRCH") throw err; // already exited
      }
    }
  }
}

if (target.removeSamContainers) {
  // A killed SAM process can't clean up its warm Lambda containers.
  const ids = await samContainerIds();
  if (ids.length === 0) {
    console.log("No SAM Lambda containers");
  } else {
    console.log(`${dryRun ? "Would remove" : "Removing"} ${ids.length} SAM Lambda container(s)`);
    if (!dryRun) await run("docker", ["rm", "-f", ...ids]);
  }
}
