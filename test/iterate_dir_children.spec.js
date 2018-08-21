const { expect } = require('./chai');
const expectedFsEntries = require('./resources/source_fs_entries');

const FsEntry = require('../lib/fs_entry');
const iterateDirChildren = require('../lib/iterate_dir_children');

describe('iterateDirChildren', function () {
  context('when path does not exist', function () {
    it('throws error', function () {
      expect(iterateDirChildren(__dirname + '/wrong/path', () => {})).to.be.rejected;
    });
  });

  context('when path corresponds to file', function () {
    it('throws error', function () {
      expect(iterateDirChildren(__filename, () => {})).to.be.rejected;
    });
  });

  context('when callback argument is not a function', function () {
    it('throws error', function () {
      expect(iterateDirChildren(__dirname, 'not a function')).to.be.rejected;
    });
  });

  context('when path corresponds to directory', function () {
    const path = __dirname + '/resources/source';

    it('triggers callback for each file/directory in source directory tree', async function () {
      const fsEntries = [];
      await iterateDirChildren(path, fsEntry => fsEntries.push(fsEntry));

      fsEntries.forEach(fsEntry => {
        expect(fsEntry).to.be.an.instanceof(FsEntry);
      });

      expect(fsEntries).to.deep.equal(expectedFsEntries);
    });

    context('when "skipEntryIteration" is called for some directory', function () {
      it('doesn\'t trigger callback for children of that directory', async function () {
        const fsEntries = [];
        await iterateDirChildren(path, (fsEntry, skipEntryIteration) => {
          fsEntries.push(fsEntry);
          if (fsEntry.name === 'subdir2') {
            skipEntryIteration();
          }
        });

        const expectedEntries = expectedFsEntries.filter(fsEntry => {
          return !fsEntry.relativePath.startsWith('subdir2/');
        });

        expect(fsEntries).to.deep.equal(expectedEntries);
      });
    });
  });
});
