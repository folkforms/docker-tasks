# docker-tasks

Common Docker workflow tasks that can be added as an npm dependency. Docker must be installed, obviously.

Can be used to build/run/debug/release Docker images of your Node projects.

## How to use

### Setup

1. Run `yarn add docker-tasks`
2. Add `"docker": "node ./node_modules/docker-tasks/docker-tasks.js"` to your `package.json` scripts section
3. Run `yarn docker genconfig`
4. Edit the new `.docker-tasks.yml` file with your project details

### Running the tasks

Run `yarn docker <option> <args>`

`yarn docker help` - Prints help text.

`yarn docker genconfig` - Generates a configuration file for you to edit with your project details.

`yarn docker build` - Builds the image.

`yarn docker run` - Runs the container.

`yarn docker debug` - Runs the container as above but overrides the entry point with `bash` so you can take a look inside. (Note: Because of how shelljs works the debug command cannot be run directly. Instead, this will print out a command for you to run yourself.)

`yarn docker release <version>` - Tags '&lt;imageName&gt;:latest' as '&lt;imageName&gt;:&lt;version&gt;', then runs "docker push &lt;imageName&gt;:latest" followed by "docker push &lt;imageName&gt;:&lt;version&gt;".

Use `-n` or `--dry-run` flag to see what commands would be run, without actually running anything.
