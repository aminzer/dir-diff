const { stat } = require('../utils/fs_promisified');

async function dirExists(path) {
  try {
    const stats = await stat(path);
    return stats.isDirectory();

  } catch (err) {
    return false;
  }
}

module.exports = dirExists;
