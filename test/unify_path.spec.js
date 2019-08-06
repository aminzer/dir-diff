const { expect } = require('./chai');
const unifyPath = require('../lib/unify_path');

describe('resolvePath', function () {
  const forwardSlashDirPath = __dirname.replace(/\\/g, '/');
  const backSlashDirPath = __dirname.replace(/\//g, '\\');

  it('replaces backslashes with forward slashes', function () {
    expect(unifyPath(backSlashDirPath)).to.eq(forwardSlashDirPath);
  });

  it('removes trailing slash', function () {
    expect(unifyPath(forwardSlashDirPath + '/')).to.eq(forwardSlashDirPath);
  });
});
