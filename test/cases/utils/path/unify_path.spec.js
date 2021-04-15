const { unifyPath } = require('../../../../src/utils/path');

describe('unifyPath', () => {
  const forwardSlashDirPath = 'c:/some/path';
  const backSlashDirPath = 'c:\\some\\path';

  it('replaces backslashes with forward slashes', () => {
    expect(unifyPath(backSlashDirPath)).toBe(forwardSlashDirPath);
  });

  it('removes trailing slash', () => {
    expect(unifyPath(`${forwardSlashDirPath}/`)).toBe(forwardSlashDirPath);
  });
});
