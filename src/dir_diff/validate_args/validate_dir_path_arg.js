const { isDirExist } = require('../../utils/fs');

async function validateDirPathArg(arg, argName) {
  if (!await isDirExist(arg)) {
    throw new Error(`${argName} "${arg}" does not exist`);
  }
}

module.exports = validateDirPathArg;
