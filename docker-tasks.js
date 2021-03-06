const shelljs = require("shelljs");

const dockerTasks = (execFunction = shelljs, props, args) => {
  const printHelpText = () => {
    execFunction.echo("docker-tasks");
    execFunction.echo("");
    execFunction.echo("Usage:");
    execFunction.echo("");
    execFunction.echo("  yarn docker-tasks help                 Prints this help text.");
    execFunction.echo("  yarn docker-tasks genconfig            Generates a configuration file for you to edit with your project details.");
    execFunction.echo("  yarn docker-tasks build [-p]           Builds the image. Use -p to prune before building.");
    execFunction.echo("  yarn docker-tasks run                  Runs the container.");
    execFunction.echo("  yarn docker-tasks debug                Runs the container as above but overrides the entry point with `bash` so you can take a look inside. (Note: Because of how shelljs works the debug command cannot be run directly. Instead, this will print out a command for you to run yourself.)");
    execFunction.echo("  yarn docker-tasks clear                Stops and removes the container.");
    execFunction.echo("  yarn docker-tasks prune                Removes unused data.");
    execFunction.echo("  yarn docker-tasks release <version>    Tags '<imageName>:latest' as '<imageName>:<version>', then runs \"docker push <imageName>:latest\" followed by \"docker push <imageName>:<version>\".");
    execFunction.echo("");
    execFunction.echo("Use -n/--dry-run to see what commands would be run, without actually running anything.");
    execFunction.echo("");
    execFunction.echo("See https://github.com/folkforms/docker-tasks for readme.");
    execFunction.echo("");
  };

  // Handle args

  const option = args.splice(0, 1)[0];
  if (!option) {
    execFunction.echo("ERROR: No option chosen.");
    execFunction.echo("");
    printHelpText();
    return 1;
  }

  let version;
  if (option === "release") {
    version = args.splice(0, 1)[0];
  }

  if (option === "help") {
    printHelpText();
    return 0;
  }

  let prune = false;
  let publicRelease = false;
  let privateRelease = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-p" || args[i] === "--prune") {
      prune = true;
      args.splice(i, 1);
      i--;
      continue;
    }
    if (args[i] === "--public") {
      publicRelease = true;
      args.splice(i, 1);
      i--;
      continue;
    }
    if (args[i] === "--private") {
      privateRelease = true;
      args.splice(i, 1);
      i--;
      continue;
    }
  }

  // Grab additional args
  let additionalArgs = [];
  for (let i = 0; i < args.length; i++) {
    additionalArgs.push(args[i]);
  }
  additionalArgs = additionalArgs.join(" ");

  if (option === "genconfig") {
    const cmd1 = "./node_modules/docker-tasks/.docker-tasks-default-config.yml";
    const cmd2 = "./.docker-tasks.yml";
    const r = execFunction.cp(cmd1, cmd2);
    if (r.code) {
      execFunction.echo(`ERROR: Could not copy file '${cmd1}' to '${cmd2}'.`);
      return 1;
    }
    execFunction.echo("Created file .docker-tasks.yml. You need to edit this file with your project details.");
    return 0;
  }

  /**
   * Validates that the given configuration properties exist.
   *
   * @param  {...string} propNames properties to validate
   */
  const validate = (...propNames) => {
    let missingProps = [];
    propNames.forEach((propName) => {
      if (!props[propName]) {
        missingProps.push(propName);
      }
    });
    if (missingProps.length > 0) {
      execFunction.echo(`ERROR: Missing configuration properties: ${missingProps.join(", ")}`);
      return 1;
    }
  };

  /**
   * Executes the given command.
   *
   * @param {string} cmd command to execute
   */
  const exec = (cmd) => {
    cmd = cmd.replace(/\s+/g, " ");
    const r = execFunction.exec(cmd);
    if (r.code) {
      execFunction.echo(`ERROR: Could not run command: '${cmd}'.`);
      return 1;
    }
    return 0;
  };

  // Handle commands

  if (option === "build") {
    const r0 = validate("imageName");
    if (r0) {
      return r0;
    }
    let r1;
    if (prune) {
      r1 = exec(`docker system prune --force`);
    }
    if (r1) {
      return r1;
    }
    return exec(`docker build ${additionalArgs} --tag ${props.imageName}:latest .`);
  }

  if (option === "prune") {
    return exec(`docker system prune --force ${additionalArgs}`);
  }

  if (option === "run") {
    const r0 = validate("imageName");
    if (r0) {
      return r0;
    }
    exec(`docker stop ${props.imageName}`);
    exec(`docker rm ${props.imageName}`);
    const runArgs = props.runArgs || "";
    return exec(`docker run ${additionalArgs} ${runArgs} --name ${props.imageName} ${props.imageName}:latest`);
  }

  if (option === "clear") {
    const r0 = validate("imageName");
    if (r0) {
      return r0;
    }
    const r1 = exec(`docker stop ${props.imageName}`);
    if (r1) {
      return r1;
    }
    return exec(`docker rm ${props.imageName}`);
  }

  if (option === "debug") {
    const r0 = validate("imageName");
    if (r0) {
      return r0;
    }
    // FIXME Is there any way to make this work?
    execFunction.echo("We can't debug directly because we are inside a script. You need to run one of these commands:");
    execFunction.echo("");
    execFunction.echo(`    docker exec --tty --interactive ${props.imageName} bash`);
    execFunction.echo(`    docker run ${additionalArgs} --tty --interactive --entrypoint bash ${props.imageName}:latest`);
    execFunction.echo("");
    execFunction.echo("The first command will run bash in a running container, the second will start a new container.");
    execFunction.echo("");
    return 0;
  }

  if (option === "release") {
    if (!version) {
      execFunction.echo("ERROR: Must include a version when using 'release' option, e.g. \"yarn docker release 1.0.0\".");
      return 1;
    }

    // Release type defaults to public if not specified in config. Default can be overridden with "--public" or "--private".
    let isPublicRelease = props.defaultRelease !== "private";
    if (publicRelease) {
      isPublicRelease = true;
    }
    if (privateRelease) {
      isPublicRelease = false;
    }

    let cmds = [];
    if (isPublicRelease) {
      const r0 = validate("imageName", "username");
      if (r0) {
        return r0;
      }
      if (version !== "latest") {
        cmds.push(`docker image tag ${additionalArgs} ${props.imageName}:latest ${props.imageName}:${version}`);
      }
      cmds.push(`docker image tag ${additionalArgs} ${props.imageName}:latest docker.io/${props.username}/${props.imageName}:${version}`);
      cmds.push(`docker image push ${additionalArgs} docker.io/${props.username}/${props.imageName}:${version}`);
    } else {
      const r0 = validate("imageName", "privateRepoUrl", "privateRepoFolder");
      if (r0) {
        return r0;
      }
      if (version !== "latest") {
        cmds.push(`docker image tag ${additionalArgs} ${props.imageName}:latest ${props.imageName}:${version}`);
      }
      cmds.push(`docker image tag ${additionalArgs} ${props.imageName}:latest ${props.privateRepoUrl}/${props.privateRepoFolder}/${props.imageName}:${version}`);
      cmds.push(`docker image push ${additionalArgs} ${props.privateRepoUrl}/${props.privateRepoFolder}/${props.imageName}:${version}`);
    }

    for (let i = 0; i < cmds.length; i++) {
      exec(cmds[i]);
    }
    return 0;
  }

  execFunction.echo(`ERROR: Unknown option '${option}'.`);
  execFunction.echo("");
  printHelpText();
  return 1;
};

module.exports = dockerTasks;
