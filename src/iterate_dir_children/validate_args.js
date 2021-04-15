const { isDirExist } = require('../utils/fs');

async function validateArgs(dirPath, onEachChild) {
  if (!await isDirExist(dirPath)) {
    throw new Error(`Directory "${dirPath}" does not exist`);
  }

  if (typeof onEachChild !== 'function') {
    throw new Error('Second argument must be a function');
  }
}

module.exports = validateArgs;
