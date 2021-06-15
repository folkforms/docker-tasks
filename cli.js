#!/usr/bin/env node

const dockerTasks = require("./docker-tasks");
process.argv.splice(0,2);
dockerTasks(undefined, process.argv);
