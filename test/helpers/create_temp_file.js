const fs = require('fs');

module.exports = (filePath, callback) => {
  try {
    fs.writeFileSync(filePath, '');
    callback(filePath);

  } finally {
    fs.existsSync(filePath) && fs.unlinkSync(filePath);
  }
};
