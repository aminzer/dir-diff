const fs = require('fs');

module.exports = (dirPath, callback) => {
  try {
    fs.mkdirSync(dirPath);
    callback(dirPath);

  } finally {
    fs.existsSync(dirPath) && fs.rmdirSync(dirPath);
  }
};
