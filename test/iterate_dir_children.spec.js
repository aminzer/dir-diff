const expect = require('chai').expect;
const createTempFile = require('./helpers/create_temp_file');
const expectedFsEntries = require('./resources/source_fs_entries');

const FsEntry = require('../lib/fs_entry');
const iterateDirChildren = require('../lib/iterate_dir_children');

describe('iterateDirChildren', function () {
  context('when path does not exist', function () {
    it('throws error', function () {
      expect(function () {
        iterateDirChildren(__dirname + '/wrong/path', () => {});
      }).to.throw();
    });
  });

  context('when path corresponds to file', function () {
    it('throws error', function () {
      expect(function () {
        createTempFile(__dirname + '/temp_file', function (path) {
          iterateDirChildren(path, () => {});
        });
      }).to.throw();
    });
  });

  context('when callback argument is not a function', function () {
    it('throws error', function () {
      expect(function () {
        iterateDirChildren(__dirname, 'not a function');
      }).to.throw();
    });
  });

  context('when path corresponds to directory', function () {
    const path = __dirname + '/resources/source';

    it('triggers callback for each file/directory in source directory tree', function () {
      const fsEntries = [];
      iterateDirChildren(path, fsEntry => fsEntries.push(fsEntry));

      fsEntries.forEach(fsEntry => {
        expect(fsEntry).to.be.an.instanceof(FsEntry);
      });

      expect(fsEntries).to.deep.equal(expectedFsEntries);
    });

    context('when "skipEntryIteration" is called for some directory', function () {
      it('doesn\'t trigger callback for children of that directory', function () {
        const fsEntries = [];
        iterateDirChildren(path, (fsEntry, skipEntryIteration) => {
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
