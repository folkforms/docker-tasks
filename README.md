# docker-tasks

Allows you to easily build/run/debug/release Docker images of your Node projects.

Docker must be installed, and you will need a `Dockerfile`. This package is so you don't have to remember all the commands.

## How to use

### Setup

1. Run `yarn add docker-tasks`
2. Run `yarn docker-tasks genconfig` to generate a `.docker-tasks.yml` file.
3. Edit `.docker-tasks.yml` and add your project details.

### Running the tasks

Run `yarn docker-tasks <option>`

- `yarn docker-tasks genconfig` generates a configuration file where you can add your project details.
- `yarn docker-tasks build` builds the image.
- `yarn docker-tasks run` runs the container.
- `yarn docker-tasks debug` runs the container but overrides the entry point with `bash` so you can take a look inside. (Note: Because of how shelljs works the debug command cannot be run directly. Instead, this will print out a command for you to run yourself.)
- `yarn docker-tasks clear` stops and removes the container.
- `yarn docker-tasks release <version>` tags `latest` with `<version>` and pushes both to the remote repo/docker.io.
- `yarn docker-tasks help` prints this help text.
- Use `-n` or `--dry-run` flag to see what commands would be run, without actually running anything.
