const { unifyPath } = require('../../src/utils/path');

describe('resolvePath', () => {
  const forwardSlashDirPath = __dirname.replace(/\\/g, '/');
  const backSlashDirPath = __dirname.replace(/\//g, '\\');

  it('replaces backslashes with forward slashes', () => {
    expect(unifyPath(backSlashDirPath)).toBe(forwardSlashDirPath);
  });

  it('removes trailing slash', () => {
    expect(unifyPath(`${forwardSlashDirPath}/`)).toBe(forwardSlashDirPath);
  });
});
