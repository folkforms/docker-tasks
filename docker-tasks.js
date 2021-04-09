const shelljs = require("shelljs");
const fs = require("fs-extra");
const yaml = require("js-yaml");

shelljs.echo("docker-tasks");

const printHelpText = () => {
  console.log("See https://github.com/folkforms/docker-tasks for readme.");
  console.log("");
  console.log("`yarn docker help` - Prints this help text.");
  console.log("`yarn docker genconfig` - Generates a configuration file for you to edit with your project details.");
  console.log("`yarn docker build` - Builds the image.");
  console.log("`yarn docker run` - Runs the container.");
  console.log("`yarn docker debug` - Runs the container as above but overrides the entry point with `bash` so you can take a look inside. (Note: Because of how shelljs works the debug command cannot be run directly. Instead, this will print out a command for you to run yourself.)");
  console.log("`yarn docker release <version>` - Tags '&lt;imageName:latest&gt;' as '&lt;imageName:version&gt;', then runs \"docker push &lt;imageName:latest&gt;\" followed by \"docker push &lt;imageName:version&gt;\".");
  console.log("Use `-n` or `--dry-run` flag to see what commands would be run, without actually running anything.");
}

// Args
const option = process.argv[2];
if(!option) {
  console.log("Error: No option chosen.");
  printHelpText();
  return 1;
}

if(option == "help") {
  printHelpText();
  return 0;
}

// FIXME Splice the param out of args when found
const dryRun = process.argv.indexOf("-n") != -1 || process.argv.indexOf("--dry-run") != -1;

if(option == "genconfig") {
  const cmd1 = "./node_modules/docker-tasks/.docker-tasks-default-config.yml";
  const cmd2 = "./.docker-tasks.yml";
  if(!dryRun) {
    shelljs.cp(cmd1, cmd2);
    console.log("Created file .docker-tasks.yml. You need to edit this file with your configuration options.");
  } else {
    console.log(`cp ${cmd1} ${cmd2}`);
  }
  return 0;
}

// Properties
let file, props;
try {
  file = fs.readFileSync('.docker-tasks.yml', 'utf8')
  props = yaml.load(file);
} catch(e) {
  console.log("ERROR: Could not read file .docker-tasks.yml. Please run `yarn docker genconfig` if you have not done so already.");
  throw e;
}

const exec = cmd => {
  if(dryRun) {
    console.log(cmd);
    return 0;
  } else {
    const r = shelljs.exec(cmd);
    if(!r) {
      console.log(`ERROR: Could not run command: '${cmd}'.`);
      exit(1);
    }
    return 0;
  }
}

if(option == "build") {
  return exec(`docker build --tag ${props.imageName}:latest .`);
}

if(option == "run") {
  const runArgs = props.runArgs || "";
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
    console.log("ERROR: Must include a version when using 'release' option, e.g. \"release 1.0.0\".");
    return 1;
  }

  // FIXME What URL/folder if using the public repo?
  // FIXME Probably need to use a different string if repoUrl is blank
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

console.log(`ERROR: Unknown option '${option}'.`);
printHelpText();
return 1;
