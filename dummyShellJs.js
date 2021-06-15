const dummyShellJs = {
  commands: [],
  echo: arg => {
    dummyShellJs.commands.push(`echo('${arg}')`);
  },
  exit: () => {},
  cp: (arg1, arg2) => {
    dummyShellJs.commands.push(`cp('${arg1}', '${arg2}')`);
    return { code: 0 };
  },
  exec: arg => {
    dummyShellJs.commands.push(`exec('${arg}')`);
    return { code: 0 };
  },
  // clear: () => {
  //   return { ...dummyShellJs, commands: [] };
  //   // const x = Object.clone(dummyShellJs);
  //   // x.commands = [];
  //   // return x;
  // }
}

module.exports = dummyShellJs
