const { stat } = require('../utils/fs_promisified');

async function dirExists(path) {
  try {
    return (await stat(path)).isDirectory();

  } catch (e) {
    return false;
  }
}

module.exports = dirExists;
