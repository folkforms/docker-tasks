const yaml = require("js-yaml");
const dummyShellJs = require("../../dummyShellJs");
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

  const exitCode = dockerTasks(dummyShellJs, props, inputArgs);

  expect(exitCode).toEqual(0);
  expect(dummyShellJs.execList.length).toEqual(expectedCommands.length);
  expectedCommands.forEach(cmd => {
    expect(dummyShellJs.execList).toContain(cmd);
  });
});
