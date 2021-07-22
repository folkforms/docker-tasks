const fs = require("fs-extra");
const yaml = require("js-yaml");
const { dummyShellJs, failingShellJs } = require("dummy-shells");
const dockerTasks = require("./docker-tasks");

let props;
try {
  const file = fs.readFileSync("./tests/.docker-tasks.yml", "utf8");
  props = yaml.load(file);
} catch (e) {
  console.error("ERROR: Could not read file ./tests/.docker-tasks.yml.");
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
  expect(dummyShellJs.echoList).toContain("ERROR: Unknown option 'foo'.");
});

test("when we pass no command we get an error message and a non-zero exit code", () => {
  const exitCode = dockerTasks(dummyShellJs, props, []);
  expect(exitCode).toEqual(1);
  expect(dummyShellJs.echoList).toContain("ERROR: No option chosen.");
});

test("we validate required properties for 'build' command", () => {
  let invalidProps = {};
  const exitCode = dockerTasks(dummyShellJs, invalidProps, ["build"]);
  expect(exitCode).toEqual(1);
  expect(dummyShellJs.echoList).toContain("ERROR: Missing configuration properties: imageName");
});

test("we validate required properties", () => {
  const required = {
    build: ["imageName"],
    run: ["imageName"],
    clear: ["imageName"],
    debug: ["imageName"],
  };
  let invalidProps = {};

  Object.keys(required).forEach((cmd) => {
    const exitCode = dockerTasks(dummyShellJs, invalidProps, [cmd]);
    expect(exitCode).toEqual(1);
    expect(dummyShellJs.echoList).toContain(`ERROR: Missing configuration properties: ${required[cmd].join(", ")}`);
  });
});

test("we validate required release <version> (public) properties", () => {
  let invalidProps = {};
  const exitCode = dockerTasks(dummyShellJs, invalidProps, [
    "release",
    "version",
  ]);
  expect(exitCode).toEqual(1);
  expect(dummyShellJs.echoList).toContain("ERROR: Missing configuration properties: imageName, username");
});

test("we validate required release latest (public) properties", () => {
  let invalidProps = {};
  const exitCode = dockerTasks(dummyShellJs, invalidProps, [
    "release",
    "latest",
  ]);
  expect(exitCode).toEqual(1);
  expect(dummyShellJs.echoList).toContain("ERROR: Missing configuration properties: imageName, username");
});

test("we validate required release <version> (private) properties", () => {
  let invalidProps = {};
  const exitCode = dockerTasks(dummyShellJs, invalidProps, [
    "release",
    "version",
    "--private",
  ]);
  expect(exitCode).toEqual(1);
  expect(dummyShellJs.echoList).toContain("ERROR: Missing configuration properties: imageName, privateRepoUrl, privateRepoFolder");
});

test("we validate required release latest (private) properties", () => {
  let invalidProps = {};
  const exitCode = dockerTasks(dummyShellJs, invalidProps, [
    "release",
    "latest",
    "--private",
  ]);
  expect(exitCode).toEqual(1);
  expect(dummyShellJs.echoList).toContain("ERROR: Missing configuration properties: imageName, privateRepoUrl, privateRepoFolder");
});

test("when 'build' fails the docker-tasks returns 1", () => {
  const exitCode = dockerTasks(failingShellJs, props, ["build"]);
  expect(exitCode).toEqual(1);
});
