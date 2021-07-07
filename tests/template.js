const dockerTasks = require("../../docker-tasks");
const dummyShellJs = require("../../dummyShellJs");

beforeEach(() => {
  dummyShellJs._clear();
});

test('{{ description | first | esq }} (file: {{ @filename }})', () => {
  const inputConfig = [
    {{ inputConfig | trimarray | doublequote | join(",\n") | indent(4) }}
  ];
  const inputArgs = "{{ inputArgs | trimarray }}".split(" ");
  const expectedCommands = [
    {{ expectedCommands | trimarray | doublequote | join(",\n") | indent(4) }}
  ];

  const exitCode = dockerTasks(dummyShellJs, inputArgs);

  expect(exitCode).toEqual(0);
  expect(dummyShellJs.execList.length).toEqual(expectedCommands.length);
  expectedCommands.forEach(cmd => {
    expect(dummyShellJs.execList).toContain(cmd);
  });
});
