const shelljs = require("shelljs");
const fs = require("fs-extra");
const yaml = require("js-yaml");

shelljs.echo("docker-tasks");

// Arguments
const option = process.argv[2];
if(!option) {
  console.log("Error: No option chosen. Usage: ... (FIXME)");
  return 1;
}

if(option == "help") {
  console.log("FIXME Print help text");
  return 0;
}

if(option == "genconfig") {
  // FIXME Use exec for dry-run support
  shelljs.cp("./node_modules/docker-tasks/.docker-tasks-default-config.yml", "./.docker-tasks.yml");
  console.log("Created file .docker-tasks.yml. You need to edit this file with your configuration options.");
  return 0; // FIXME What does shelljs.cp return?
}

// FIXME If file is not found suggest running "genconfig" and editing the file
// Properties
const file = fs.readFileSync('.docker-tasks.yml', 'utf8')
const props = yaml.load(file);

// FIXME Splice the param out of args when found
const dryRun = process.argv.indexOf("-n") != -1 || process.argv.indexOf("--dry-run") != -1;

// FIXME If this fails just abort immediately, don't return
const exec = cmd => {
  if(dryRun) {
    console.log(cmd);
    return 0;
  } else {
    const r = shelljs.exec(cmd); // FIXME What does shelljs.exec return? I think it's non-zero = good.
    if(!r) {
      console.log(`Error running command: '${cmd}'.`);
      exit(1);
    }
    return 0;
  }
}

if(option == "build") {
  return exec(`docker build --tag ${props.imageName}:latest .`);
}

if(option == "run") {
  return exec(`docker run ${props.runArgs} ${props.imageName}:latest`);
}

if(option == "debug") {
  // FIXME Is there any way to make this work automatically?
  console.log("We can't debug directly because we are inside a script. You need to run this command:");
  console.log("");
  console.log(`    docker run --tty --interactive --entrypoint bash ${props.imageName}:latest`);
  console.log("");
  return 0;
}

if(option == "release") {
  const version = process.argv[3];
  if(!version) {
    console.log("Error: Must include a version when using 'release' option, e.g. \"release 1.0.0\".");
    return 1;
  }

  // FIXME What URL/folder if using a local repo?
  // FIXME What URL/folder if using the public repo?
  // FIXME Probably use a different string if repoUrl is blank
  const cmds = [
    `docker image tag ${props.imageName}:latest ${props.imageName}:${version}`,
    `docker image tag ${props.imageName}:latest ${props.repoUrl}/${props.repoFolder}/${props.imageName}:${version}`,
    `docker image tag ${props.imageName}:latest ${props.repoUrl}/${props.repoFolder}/${props.imageName}:latest`,
    `docker image push ${props.repoUrl}/${props.repoFolder}/${props.imageName}:latest`,
    `docker image push ${props.repoUrl}/${props.repoFolder}/${props.imageName}:${version}`
  ];
  for(let i = 0; i < cmds.length; i++) {
    exec(cmds[i]);
  }
  return 0;
}

console.log(`Error: Unknown option '${option}'. FIXME print usage.`);
return 1;
