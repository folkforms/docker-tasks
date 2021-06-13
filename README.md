# docker-tasks

Allows you to easily build/run/debug/release Docker images of your Node projects.

Docker must be installed, and you will need a `Dockerfile`. This package is so you don't have to remember all the commands.

## How to use

### Setup

1. Run `yarn add docker-tasks`
2. Add `"docker": "docker-tasks"` to your `package.json` scripts.
3. Run `yarn docker genconfig` to generate a `.docker-tasks.yml` file.
4. Edit `.docker-tasks.yml` and add your project details.

### Running the tasks

Run `yarn docker <option>`

- `yarn docker genconfig` generates a configuration file where you can add your project details.
- `yarn docker build` builds the image.
- `yarn docker start` starts the container.
- `yarn docker run` runs the container.
- `yarn docker debug` runs the container but overrides the entry point with `bash` so you can take a look inside. (Note: Because of how shelljs works the debug command cannot be run directly. Instead, this will print out a command for you to run yourself.)
- `yarn docker release <version>` tags '&lt;imageName&gt;:latest' as '&lt;imageName&gt;:&lt;version&gt;', then runs "docker push &lt;imageName&gt;:latest" followed by "docker push &lt;imageName&gt;:&lt;version&gt;".
- `yarn docker help` prints this help text.
- Use `-n` or `--dry-run` flag to see what commands would be run, without actually running anything.
