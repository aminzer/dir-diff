const fs = require('fs');
const { promisify } = require('util');

exports.stat = promisify(fs.stat);
exports.readdir = promisify(fs.readdir);
exports.writeFile = promisify(fs.writeFile);
exports.unlink = promisify(fs.unlink);
exports.mkdir = promisify(fs.mkdir);
exports.rmdir = promisify(fs.rmdir);
