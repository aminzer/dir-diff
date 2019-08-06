const fs = require('fs');
const { promisify } = require('util');

module.exports = {
  mkdir: promisify(fs.mkdir),
  readdir: promisify(fs.readdir),
  rmdir: promisify(fs.rmdir),
  stat: promisify(fs.stat),
  unlink: promisify(fs.unlink),
  writeFile: promisify(fs.writeFile)
};
