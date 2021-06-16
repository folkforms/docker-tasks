const dummyShellJs = {
  _clear: () => {
    dummyShellJs.echoList = [];
    dummyShellJs.cpList = [];
    dummyShellJs.execList = [];
  },
  exit: () => {},
  echoList: [],
  echo: arg => {
    dummyShellJs.echoList.push(arg);
  },
  cpList: [],
  cp: (arg1, arg2) => {
    dummyShellJs.cpList.push(`cp ${arg1} ${arg2}`);
    return { code: 0 };
  },
  execList: [],
  exec: arg => {
    dummyShellJs.execList.push(arg);
    return { code: 0 };
  },
}

module.exports = dummyShellJs
