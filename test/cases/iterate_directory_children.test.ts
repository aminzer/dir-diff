import * as path from 'path';
import { iterateDirectoryChildren } from '../../dist';
import { FsEntry } from '../../dist/models';
import expectedFsEntries from '../resources/common/expected_source_fs_entries';

const callback = () => { };

describe('iterateDirectoryChildren', () => {
  describe('when path does not exist', () => {
    const invalidDirPath = path.join(__dirname, 'invalid/path');

    it('throws error', async () => {
      await expect(iterateDirectoryChildren(invalidDirPath, callback))
        .rejects
        .toThrow(`Directory "${invalidDirPath}" does not exist`);
    });
  });

  describe('when path corresponds to file', () => {
    const filePath = __filename;

    it('throws error', async () => {
      await expect(iterateDirectoryChildren(filePath, callback))
        .rejects
        .toThrow(`Directory "${filePath}" does not exist`);
    });
  });

  describe('when "onEachChild" callback is not a function', () => {
    describe('when "onEachChild" callback isn\'t set', () => {
      it('throws error', async () => {
        await expect(iterateDirectoryChildren(__dirname, undefined as any))
          .rejects
          .toThrow('"onEachChild" is not a function');
      });
    });

    describe('when "onEachChild" callback is a string', () => {
      it('throws error', async () => {
        await expect(iterateDirectoryChildren(__dirname, 'not a function' as any))
          .rejects
          .toThrow('"onEachChild" is not a function');
      });
    });
  });

  describe('when path corresponds to directory', () => {
    const dirPath = path.join(__dirname, '../resources/common/source');

    it('triggers callback for each file and directory in source directory tree', async () => {
      const fsEntries = [];
      await iterateDirectoryChildren(dirPath, (fsEntry) => {
        fsEntries.push(fsEntry);
      });

      expect(fsEntries.every((fsEntry) => fsEntry instanceof FsEntry)).toBe(true);
      expect(fsEntries).toEqual(expectedFsEntries);
    });

    describe('when "skipEntryChildrenIteration" is called for some directory', () => {
      it('doesn\'t trigger callback for children of that directory', async () => {
        const fsEntries = [];
        await iterateDirectoryChildren(dirPath, (fsEntry, { skipEntryChildrenIteration }) => {
          fsEntries.push(fsEntry);
          if (fsEntry.name === 'subdir2') {
            skipEntryChildrenIteration();
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
