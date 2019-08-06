function resolvePath(path) {
  return path
    .replace(/\\/g, '/')
    .replace(/\/$/, '');
}

module.exports = resolvePath;
