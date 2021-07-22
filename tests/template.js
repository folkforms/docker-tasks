const yaml = require("js-yaml");
const { dummyShellJs } = require("dummy-shells");
const dockerTasks = require("../../docker-tasks");

beforeEach(() => {
  dummyShellJs._clear();
});

test('{{ description | first | esq }} (file: {{ @filename }})', () => {
  const inputConfig = [
    {{ inputConfig | trimarray | doublequote | join(",\n") | indent(4) }}
  ];
  const props = yaml.load(inputConfig.join("\n"));
  const inputArgs = "{{ inputArgs | trimarray }}".split(" ");
  const expectedCommands = [
    {{ expectedCommands | trimarray | doublequote | join(",\n") | indent(4) }}
  ];
  const expectedEchos = [
    {{ expectedEchos | trimarray | doublequote | join(",\n") | indent(4) }}
  ];
  const expectedErrorCode = {{ expectedErrorCode | trimarray | usedefault(0) }};

  const exitCode = dockerTasks(dummyShellJs, props, inputArgs);

  expect(exitCode).toEqual(expectedErrorCode);
  expectedCommands.forEach(cmd => {
    expect(dummyShellJs.execList).toContain(cmd);
  });
  expect(dummyShellJs.execList.length).toEqual(expectedCommands.length);
  expectedEchos.forEach(cmd => {
    expect(dummyShellJs.echoList).toContain(cmd);
  });
  expect(dummyShellJs.echoList.length).toEqual(expectedEchos.length);
});
