function unifyPath(path) {
  return path
    .replace(/\\/g, '/')
    .replace(/\/$/, '');
}

module.exports = {
  unifyPath,
};
