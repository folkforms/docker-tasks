#!/usr/bin/env node

const dockerTasks = require("./docker-tasks");
const dryRunShellJs = require("./dryRunShellJs");

process.argv.splice(0,2); // Remove node and script name

// Strip out "-n/--dry-run" argument if present
let dryRun = false;
for(let i = 0; i < process.argv.length; i++) {
  if(process.argv[i] === "-n" || process.argv[i] === "--dry-run") {
    dryRun = true;
    process.argv.splice(i, 1);
    i--;
    continue;
  }
}
const shell = dryRun ? dryRunShellJs : undefined;

if(dryRun) { console.log(""); }

dockerTasks(shell, process.argv);

if(dryRun) { console.log(""); }
