const dockerTasks = require("./docker-tasks");
const dummyShellJs = require("./dummyShellJs");

beforeEach(() => {
  dummyShellJs._clear();
});

test("when we call 'genconfig' it executes the correct command", () => {
  const exitCode = dockerTasks(dummyShellJs, ["genconfig"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.cpList).toContain("cp ./node_modules/docker-tasks/.docker-tasks-default-config.yml ./.docker-tasks.yml");
});

test("when we call 'build' it executes the correct command", () => {
  const exitCode = dockerTasks(dummyShellJs, ["build"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.execList.length).toEqual(1);
  expect(dummyShellJs.execList).toContain("docker build --tag foo:latest .");
});

test("when we call 'build -p' it executes the correct commands", () => {
  const exitCode = dockerTasks(dummyShellJs, ["build", "-p"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.execList.length).toEqual(2);
  expect(dummyShellJs.execList).toContain("docker system prune --force");
  expect(dummyShellJs.execList).toContain("docker build --tag foo:latest .");
});

test("when we call 'prune' it executes the correct commands", () => {
  const exitCode = dockerTasks(dummyShellJs, ["prune"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.execList.length).toEqual(1);
  expect(dummyShellJs.execList).toContain("docker system prune --force");
});

test("when we call 'run' it executes the correct command", () => {
  const exitCode = dockerTasks(dummyShellJs, ["run"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.execList).toContain("docker run -p 3000:3000 --name foo foo:latest");
});

test("when we call 'debug' it executes the correct command", () => {
  const exitCode = dockerTasks(dummyShellJs, ["debug"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.echoList).toContain("docker run  --tty --interactive --entrypoint bash foo:latest");
});

test("when we call 'clear' it executes the correct commands", () => {
  const exitCode = dockerTasks(dummyShellJs, ["clear"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.execList.length).toEqual(2);
  expect(dummyShellJs.execList).toContain("docker stop foo");
  expect(dummyShellJs.execList).toContain("docker rm foo");
});

test("when we call 'release 1.0.0' it executes the correct commands", () => {
  const exitCode = dockerTasks(dummyShellJs, ["release", "1.0.0"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.execList.length).toEqual(5);
  expect(dummyShellJs.execList).toContain("docker image tag foo:latest foo:1.0.0");
  expect(dummyShellJs.execList).toContain("docker image tag foo:latest docker.io/folkforms/foo:1.0.0");
  expect(dummyShellJs.execList).toContain("docker image tag foo:latest docker.io/folkforms/foo:latest");
  expect(dummyShellJs.execList).toContain("docker image push docker.io/folkforms/foo:latest");
  expect(dummyShellJs.execList).toContain("docker image push docker.io/folkforms/foo:1.0.0");
});

test("when we call 'release latest' it executes the correct commands", () => {
  const exitCode = dockerTasks(dummyShellJs, ["release", "latest"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.execList.length).toEqual(2);
  expect(dummyShellJs.execList).toContain("docker image tag foo:latest docker.io/folkforms/foo:latest");
  expect(dummyShellJs.execList).toContain("docker image push docker.io/folkforms/foo:latest");
});

test("when we pass an unknown command we get an error message and a non-zero exit code", () => {
  const exitCode = dockerTasks(dummyShellJs, ["foo"]);
  expect(exitCode).toEqual(1);
  expect(dummyShellJs.echoList).toContain("ERROR: Unknown option \'foo\'.");
});

test("when we pass no command we get an error message and a non-zero exit code", () => {
  const exitCode = dockerTasks(dummyShellJs, []);
  expect(exitCode).toEqual(1);
  expect(dummyShellJs.echoList).toContain("ERROR: No option chosen.");
});
