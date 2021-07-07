const fs = require("fs-extra");
const yaml = require("js-yaml");
const dummyShellJs = require("./dummyShellJs");
const dockerTasks = require("./docker-tasks");

let props;
try {
  const file = fs.readFileSync('.docker-tasks.yml', 'utf8')
  props = yaml.load(file);
} catch(e) {
  console.error("ERROR: Could not read file .docker-tasks.yml.");
  throw e;
}

beforeEach(() => {
  dummyShellJs._clear();
});

test("when we call 'genconfig' it executes the correct command", () => {
  const exitCode = dockerTasks(dummyShellJs, props, ["genconfig"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.execList).toContain("cp ./node_modules/docker-tasks/.docker-tasks-default-config.yml ./.docker-tasks.yml");
});

test("when we call 'build' it executes the correct command", () => {
  const exitCode = dockerTasks(dummyShellJs, props, ["build"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.execList.length).toEqual(1);
  expect(dummyShellJs.execList).toContain("docker build --tag foo:latest .");
});

test("when we call 'build -p' it executes the correct commands", () => {
  const exitCode = dockerTasks(dummyShellJs, props, ["build", "-p"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.execList.length).toEqual(2);
  expect(dummyShellJs.execList).toContain("docker system prune --force");
  expect(dummyShellJs.execList).toContain("docker build --tag foo:latest .");
});

test("when we call 'prune' it executes the correct commands", () => {
  const exitCode = dockerTasks(dummyShellJs, props, ["prune"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.execList.length).toEqual(1);
  expect(dummyShellJs.execList).toContain("docker system prune --force");
});

test("when we call 'run' it executes the correct command", () => {
  const exitCode = dockerTasks(dummyShellJs, props, ["run"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.execList).toContain("docker run -p 3000:3000 --name foo foo:latest");
});

test("when we call 'debug' it executes the correct command", () => {
  const exitCode = dockerTasks(dummyShellJs, props, ["debug"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.echoList).toContain("docker exec --tty --interactive foo bash");
  expect(dummyShellJs.echoList).toContain("docker run  --tty --interactive --entrypoint bash foo:latest");
});

test("when we call 'clear' it executes the correct commands", () => {
  const exitCode = dockerTasks(dummyShellJs, props, ["clear"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.execList.length).toEqual(2);
  expect(dummyShellJs.execList).toContain("docker stop foo");
  expect(dummyShellJs.execList).toContain("docker rm foo");
});

test("when we call 'release 1.0.0' it executes the correct commands", () => {
  const exitCode = dockerTasks(dummyShellJs, props, ["release", "1.0.0"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.execList.length).toEqual(5);
  expect(dummyShellJs.execList).toContain("docker image tag foo:latest foo:1.0.0");
  expect(dummyShellJs.execList).toContain("docker image tag foo:latest docker.io/folkforms/foo:1.0.0");
  expect(dummyShellJs.execList).toContain("docker image tag foo:latest docker.io/folkforms/foo:latest");
  expect(dummyShellJs.execList).toContain("docker image push docker.io/folkforms/foo:latest");
  expect(dummyShellJs.execList).toContain("docker image push docker.io/folkforms/foo:1.0.0");
});

test("when we call 'release latest' it executes the correct commands", () => {
  const exitCode = dockerTasks(dummyShellJs, props, ["release", "latest"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.execList.length).toEqual(2);
  expect(dummyShellJs.execList).toContain("docker image tag foo:latest docker.io/folkforms/foo:latest");
  expect(dummyShellJs.execList).toContain("docker image push docker.io/folkforms/foo:latest");
});

test("when we pass an unknown command we get an error message and a non-zero exit code", () => {
  const exitCode = dockerTasks(dummyShellJs, props, ["foo"]);
  expect(exitCode).toEqual(1);
  expect(dummyShellJs.echoList).toContain("ERROR: Unknown option \'foo\'.");
});

test("when we pass no command we get an error message and a non-zero exit code", () => {
  const exitCode = dockerTasks(dummyShellJs, props, []);
  expect(exitCode).toEqual(1);
  expect(dummyShellJs.echoList).toContain("ERROR: No option chosen.");
});
