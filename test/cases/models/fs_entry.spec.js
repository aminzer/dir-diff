const { FsEntry } = require('../../../src/models');

describe('FsEntry', () => {
  describe('#constructor', () => {
    it('initializes instance with correct params', () => {
      const opts = {
        name: 'name',
        absolutePath: '/absolute/path',
        relativePath: 'path',
        isFile: true,
        size: 32,
      };

      const fsEntry = new FsEntry(opts);

      expect(fsEntry).toEqual(opts);
    });
  });

  describe('#isDirectory', () => {
    it('returns boolean opposite to "isFile', () => {
      expect(new FsEntry({ isFile: true }).isDirectory).toBe(false);
      expect(new FsEntry({ isFile: false }).isDirectory).toBe(true);
    });
  });
});
