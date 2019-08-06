const { expect } = require('./chai');
const FsEntry = require('../lib/fs_entry');

describe('FsEntry', function () {
  describe('#constructor', function () {
    it('initializes instance with correct params', function () {
      const opts = {
        name: 'name',
        absolutePath: '/absolute/path',
        relativePath: 'path',
        isFile: true,
        size: 32
      };

      const fsEntry = new FsEntry(opts);

      expect(fsEntry).to.deep.eq(opts);
    });
  });

  describe('#isDirectory', function () {
    it('returns boolean opposite to "isFile', function () {
      expect(new FsEntry({ isFile: true }).isDirectory).to.be.false;
      expect(new FsEntry({ isFile: false }).isDirectory).to.be.true;
    });
  });
});
