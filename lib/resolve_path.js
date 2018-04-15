const pathModule = require('path');

function resolvePath(path) {
  return pathModule.resolve(path).replace(/\\/g, '/');
}

module.exports = resolvePath;
