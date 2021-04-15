const fs = require('fs');
const util = require('util');
const streamEqual = require('stream-equal');

const mkdir = util.promisify(fs.mkdir);
const readdir = util.promisify(fs.readdir);
const rmdir = util.promisify(fs.rmdir);
const stat = util.promisify(fs.stat);
const unlink = util.promisify(fs.unlink);
const writeFile = util.promisify(fs.writeFile);

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
  mkdir,
  readdir,
  rmdir,
  stat,
  unlink,
  writeFile,
};
