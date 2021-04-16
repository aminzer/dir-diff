const fs = require('fs');
const util = require('util');
const streamEqual = require('stream-equal');

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

async function isDirExist(path) {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch (err) {
    return false;
  }
}

async function isContentEqual(fileEntry1, fileEntry2) {
  const stream1 = fs.createReadStream(fileEntry1.absolutePath);
  const stream2 = fs.createReadStream(fileEntry2.absolutePath);

  return streamEqual(stream1, stream2);
}

module.exports = {
  isDirExist,
  isContentEqual,
  readdir,
  stat,
};
