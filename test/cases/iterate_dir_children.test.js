const path = require('path');
const iterateDirChildren = require('../../src/iterate_dir_children');
const { FsEntry } = require('../../src/models');
const expectedFsEntries = require('../resources/common/source_fs_entries');

const callback = () => { };

describe('iterateDirChildren', () => {
  describe('when path does not exist', () => {
    const invalidDirPath = path.join(__dirname, 'invalid/path');

    it('throws error', async () => {
      await expect(iterateDirChildren(invalidDirPath, callback))
        .rejects
        .toThrow(`Directory "${invalidDirPath}" does not exist`);
    });
  });

  describe('when path corresponds to file', () => {
    const filePath = __filename;

    it('throws error', async () => {
      await expect(iterateDirChildren(filePath, callback))
        .rejects
        .toThrow(`Directory "${filePath}" does not exist`);
    });
  });

  describe('when "onEachChild" callback is not a function', () => {
    describe('when "onEachChild" callback isn\'t set', () => {
      it('throws error', async () => {
        await expect(iterateDirChildren(__dirname))
          .rejects
          .toThrow('"onEachChild" is not a function');
      });
    });

    describe('when "onEachChild" callback is a string', () => {
      it('throws error', async () => {
        await expect(iterateDirChildren(__dirname, 'not a function'))
          .rejects
          .toThrow('"onEachChild" is not a function');
      });
    });
  });

  describe('when path corresponds to directory', () => {
    const dirPath = path.join(__dirname, '../resources/common/source');

    it('triggers callback for each file and directory in source directory tree', async () => {
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

        const pathPartToSkip = path.join('subdir2/');
        const expectedEntries = expectedFsEntries.filter(({ relativePath }) => (
          !relativePath.includes(pathPartToSkip)
        ));

        expect(fsEntries).toEqual(expectedEntries);
      });
    });
  });
});
