# docker-tasks

Common Docker workflow tasks that can be added as an npm dependency. Docker must be installed, obviously.

Useful to build/run/debug/release your Docker images.

Written because I kept adding the same commands to every project.

## How To Use

Run: `yarn add docker-tasks`

Add the following to your package.json scripts:

`"docker": "node ./node_modules/docker-tasks/docker-tasks.js"`

Run: `yarn docker genconfig`

Edit the config file (see notes below)

Run: `yarn docker <option> <args>`

## Configuration

Use `yarn docker genconfig` to create a configuration file. Edit/delete the following values as appropriate:

```
imageName: <image name> (required)
runArgs: <args to be passed to docker run command, e.g. "-p 3000:3000">
repoUrl: <repo url for private repo>
repoFolder: <folder name on private repo>
```

## Options

`yarn docker help` - Prints some help text.

`yarn docker genconfig` - Generates a configuration file for you to edit with your project details.

`yarn docker build` - Builds the image.

`yarn docker run` - Runs the container.

`yarn docker debug` - Runs the container as above but overrides the entry point with `bash` so you can take a look inside. (Note: Because of how shelljs works the debug command cannot be run directly. Instead, this will print out a command for you to run yourself.)

`yarn docker release <version>` - Tags '&lt;imageName:latest&gt;' as '&lt;imageName:version&gt;', then runs "docker push &lt;imageName:latest&gt;" followed by "docker push &lt;imageName:version&gt;".

Use the `-n` or `--dry-run` flag to see what commands would be run, without actually running anything.
