const shelljs = require("shelljs");
const fs = require("fs-extra");
const yaml = require("js-yaml");

const dockerTasks = (execFunction = shelljs, args) => {

  execFunction.echo("docker-tasks");
  execFunction.echo("");

  const printHelpText = () => {
    execFunction.echo("Usage:");
    execFunction.echo("");
    execFunction.echo("  yarn docker help                 Prints this help text.");
    execFunction.echo("  yarn docker genconfig            Generates a configuration file for you to edit with your project details.");
    execFunction.echo("  yarn docker build                Builds the image.");
    execFunction.echo("  yarn docker run                  Runs the container.");
    execFunction.echo("  yarn docker debug                Runs the container as above but overrides the entry point with `bash` so you can take a look inside. (Note: Because of how shelljs works the debug command cannot be run directly. Instead, this will print out a command for you to run yourself.)");
    execFunction.echo("  yarn docker clear                Stops and removes the container.");
    execFunction.echo("  yarn docker release <version>    Tags '<imageName>:latest' as '<imageName>:<version>', then runs \"docker push <imageName>:latest\" followed by \"docker push <imageName>:<version>\".");
    execFunction.echo("");
    execFunction.echo("Use -n/--dry-run to see what commands would be run, without actually running anything.");
    execFunction.echo("");
    execFunction.echo("See https://github.com/folkforms/docker-tasks for readme.");
    execFunction.echo("");
  }

  // Handle args

  const option = args[0];
  if(!option) {
    execFunction.echo("ERROR: No option chosen.");
    execFunction.echo("");
    printHelpText();
    return 1;
  }

  if(option == "help") {
    printHelpText();
    return 0;
  }

  let dryRun = false;
  for(let i = 0; i < args.length; i++) {
    if(args[i] === "-n" || args[i] === "--dry-run") {
      dryRun = true;
      args.splice(i, 1);
      break;
    }
  }

  if(option == "genconfig") {
    const cmd1 = "./node_modules/docker-tasks/.docker-tasks-default-config.yml";
    const cmd2 = "./.docker-tasks.yml";
    if(!dryRun) {
      const r = execFunction.cp(cmd1, cmd2);
      if(r.code) {
        execFunction.echo(`ERROR: Could not copy file '${cmd1}' to '${cmd2}'.`);
        return 1;
      }
      execFunction.echo("Created file .docker-tasks.yml. You need to edit this file with your project details.");
    } else {
      execFunction.echo(`cp ${cmd1} ${cmd2}`);
    }
    return 0;
  }

  // Load properties

  let file, props;
  try {
    file = fs.readFileSync('.docker-tasks.yml', 'utf8')
    props = yaml.load(file);
  } catch(e) {
    execFunction.echo("ERROR: Could not read file .docker-tasks.yml. Please run `yarn docker genconfig` if you have not done so already.");
    throw e;
  }

  /**
   * Executes the given command. If there is an error it will call `execFunction.exit(1)`.
   *
   * @param {string} cmd command to execute
   */
  const exec = cmd => {
    cmd = cmd.replace(/\s+/g, " ");
    if(dryRun) {
      execFunction.echo(cmd);
      return 0;
    } else {
      const r = execFunction.exec(cmd);
      if(r.code) {
        execFunction.echo(`ERROR: Could not run command: '${cmd}'.`);
        return 1;
      }
      return 0;
    }
  }

  // Grab additional args
  let additionalArgs = [];
  let startIndex = 1;
  if(option === "release") {
    startIndex = 2;
  }
  for(let i = startIndex; i < args.length; i++) {
    additionalArgs.push(args[i]);
  }
  additionalArgs = additionalArgs.join(" ");

  // Handle commands

  if(option == "build") {
    exec(`docker build ${additionalArgs} --tag ${props.imageName}:latest .`);
    return 0;
  }

  if(option == "run") {
    const runArgs = props.runArgs || "";
    return exec(`docker run ${additionalArgs} ${runArgs} --name ${props.imageName} ${props.imageName}:latest`);
  }

  if(option == "clear") {
    const r1 = exec(`docker stop ${props.imageName}`);
    if(r1) {
      return r1;
    }
    const r2 = exec(`docker rm ${props.imageName}`);
    return r2;
  }

  if(option == "debug") {
    // FIXME Is there any way to make this work?
    execFunction.echo("We can't debug directly because we are inside a script. You need to run this command:");
    execFunction.echo("");
    execFunction.echo(`    docker run ${additionalArgs} --tty --interactive --entrypoint bash ${props.imageName}:latest`);
    execFunction.echo("");
    return 0;
  }

  if(option == "release") {
    const version = args[1];
    if(!version) {
      execFunction.echo("ERROR: Must include a version when using 'release' option, e.g. \"yarn docker release 1.0.0\".");
      return 1;
    }

    const repoUrl = props.repoUrl || "docker.io";
    const cmds = [
      `docker image tag ${additionalArgs} ${props.imageName}:latest ${props.imageName}:${version}`,
      `docker image tag ${additionalArgs} ${props.imageName}:latest ${repoUrl}/${props.repoFolder}/${props.imageName}:${version}`,
      `docker image tag ${additionalArgs} ${props.imageName}:latest ${repoUrl}/${props.repoFolder}/${props.imageName}:latest`,
      `docker image push ${additionalArgs} ${repoUrl}/${props.repoFolder}/${props.imageName}:latest`,
      `docker image push ${additionalArgs} ${repoUrl}/${props.repoFolder}/${props.imageName}:${version}`
    ];
    for(let i = 0; i < cmds.length; i++) {
      exec(cmds[i]);
    }
    return 0;
  }

  execFunction.echo(`ERROR: Unknown option '${option}'.`);
  execFunction.echo("");
  printHelpText();
  return 1;
}

module.exports = dockerTasks;
