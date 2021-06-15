const dockerTasks = require("./docker-tasks");
const dummyShellJs = require("./dummyShellJs");

beforeEach(() => {
  dummyShellJs.commands = [];
});

test("when we call 'genconfig' it executes the correct command", () => {
  const exitCode = dockerTasks(dummyShellJs, ["genconfig"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.commands).toContain("cp('./node_modules/docker-tasks/.docker-tasks-default-config.yml', './.docker-tasks.yml')");
});

test("when we call 'build' it executes the correct command", () => {
  const exitCode = dockerTasks(dummyShellJs, ["build"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.commands).toContain("exec('docker build --tag foo:latest .')");
});

test("when we call 'run' it executes the correct command", () => {
  const exitCode = dockerTasks(dummyShellJs, ["run"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.commands).toContain("exec('docker run -p 3000:3000 --name foo foo:latest')");
});

test("when we call 'debug' it executes the correct command", () => {
  const exitCode = dockerTasks(dummyShellJs, ["debug"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.commands).toContain("echo('    docker run  --tty --interactive --entrypoint bash foo:latest')");
});

test("when we call 'clear' it executes the correct commands", () => {
  const exitCode = dockerTasks(dummyShellJs, ["clear"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.commands.length).toEqual(4); // 2 lines of info text plus 2 commands
  expect(dummyShellJs.commands).toContain("exec('docker stop foo')");
  expect(dummyShellJs.commands).toContain("exec('docker rm foo')");
});

test("when we call 'release 1.0.0' it executes the correct commands", () => {
  const exitCode = dockerTasks(dummyShellJs, ["release", "1.0.0"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.commands.length).toEqual(7); // 2 lines of info text plus 5 commands
  expect(dummyShellJs.commands).toContain("exec('docker image tag foo:latest foo:1.0.0')");
  expect(dummyShellJs.commands).toContain("exec('docker image tag foo:latest docker.io/folkforms/foo:1.0.0')");
  expect(dummyShellJs.commands).toContain("exec('docker image tag foo:latest docker.io/folkforms/foo:latest')");
  expect(dummyShellJs.commands).toContain("exec('docker image push docker.io/folkforms/foo:latest')");
  expect(dummyShellJs.commands).toContain("exec('docker image push docker.io/folkforms/foo:1.0.0')");
});

test("when we call 'release latest' it executes the correct commands", () => {
  const exitCode = dockerTasks(dummyShellJs, ["release", "latest"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.commands).toContain("exec('docker image tag foo:latest docker.io/folkforms/foo:latest')");
  expect(dummyShellJs.commands).toContain("exec('docker image push docker.io/folkforms/foo:latest')");
});

test("when we pass an unknown command we get an error message and a non-zero exit code", () => {
  const exitCode = dockerTasks(dummyShellJs, ["foo"]);
  expect(exitCode).toEqual(1);
  expect(dummyShellJs.commands).toContain("echo('ERROR: Unknown option \'foo\'.')");
});

test("when we pass no command we get an error message and a non-zero exit code", () => {
  const exitCode = dockerTasks(dummyShellJs, []);
  expect(exitCode).toEqual(1);
  expect(dummyShellJs.commands).toContain("echo('ERROR: No option chosen.')");
});
