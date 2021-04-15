const path = require('path');
const { FsEntry } = require('../../src/models');
const iterateDirChildren = require('../../src/iterate_dir_children');
const expectedFsEntries = require('../resources/source_fs_entries');

const callback = () => { };

describe('iterateDirChildren', () => {
  describe('when path does not exist', () => {
    it('throws error', async () => {
      await expect(iterateDirChildren(`${__dirname}/wrong/path`, callback)).rejects.toThrow();
    });
  });

  describe('when path corresponds to file', () => {
    it('throws error', async () => {
      await expect(iterateDirChildren(__filename, callback)).rejects.toThrow();
    });
  });

  describe('when callback argument is not a function', () => {
    it('throws error', async () => {
      await expect(iterateDirChildren(__dirname, 'not a function')).rejects.toThrow();
    });
  });

  describe('when path corresponds to directory', () => {
    const dirPath = path.resolve(`${__dirname}/../resources/source`);

    it('triggers callback for each file/directory in source directory tree', async () => {
      const fsEntries = [];
      await iterateDirChildren(dirPath, (fsEntry) => fsEntries.push(fsEntry));

      expect(fsEntries.every((fsEntry) => fsEntry instanceof FsEntry)).toBe(true);
      expect(fsEntries).toEqual(expectedFsEntries);
    });

    describe('when "skipEntryIteration" is called for some directory', () => {
      it('doesn\'t trigger callback for children of that directory', async () => {
        const fsEntries = [];
        await iterateDirChildren(dirPath, (fsEntry, { skipEntryIteration }) => {
          fsEntries.push(fsEntry);
          if (fsEntry.name === 'subdir2') {
            skipEntryIteration();
          }
        });

        const expectedEntries = expectedFsEntries.filter((fsEntry) => !fsEntry.relativePath.startsWith('subdir2/'));

        expect(fsEntries).toEqual(expectedEntries);
      });
    });
  });
});