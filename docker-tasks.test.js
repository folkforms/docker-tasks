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

test("when we call 'debug' it executes the correct command", () => {
  const exitCode = dockerTasks(dummyShellJs, props, ["debug"]);
  expect(exitCode).toEqual(0);
  expect(dummyShellJs.echoList).toContain("docker exec --tty --interactive foo bash");
  expect(dummyShellJs.echoList).toContain("docker run  --tty --interactive --entrypoint bash foo:latest");
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
