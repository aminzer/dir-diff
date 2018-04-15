const fs = require('fs');

function dirExists(path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch (e) {
    return false;
  }
}

module.exports = dirExists;
