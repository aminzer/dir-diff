import * as path from 'path';
import { iterateDirectoryChildren } from '../../dist';
import { FsEntry } from '../../dist/models';
import expectedFsEntries from '../resources/common/expected_source_fs_entries';

const callback = () => { };

describe('iterateDirectoryChildren', () => {
  describe('when path does not exist', () => {
    const invalidDirPath = path.join(__dirname, 'invalid/path');

    it('is rejected with error', async () => {
      await expect(iterateDirectoryChildren(invalidDirPath, callback))
        .rejects
        .toThrow(`Directory "${invalidDirPath}" does not exist`);
    });
  });

  describe('when path corresponds to file', () => {
    const filePath = __filename;

    it('is rejected with error', async () => {
      await expect(iterateDirectoryChildren(filePath, callback))
        .rejects
        .toThrow(`Directory "${filePath}" does not exist`);
    });
  });

  describe('when "onEachChild" callback is not a function', () => {
    describe('when "onEachChild" callback isn\'t set', () => {
      it('is rejected with error', async () => {
        await expect(iterateDirectoryChildren(__dirname, undefined as any))
          .rejects
          .toThrow('"onEachChild" is not a function');
      });
    });

    describe('when "onEachChild" callback is a string', () => {
      it('is rejected with error', async () => {
        await expect(iterateDirectoryChildren(__dirname, 'not a function' as any))
          .rejects
          .toThrow('"onEachChild" is not a function');
      });
    });
  });

  describe('when path corresponds to directory', () => {
    const dirPath = path.join(__dirname, '../resources/common/source');

    describe('when callback is executed without rejections for each element', () => {
      let fsEntries;
      let returnValue;

      beforeEach(async () => {
        fsEntries = [];

        returnValue = iterateDirectoryChildren(dirPath, (fsEntry) => {
          fsEntries.push(fsEntry);
        });
      });

      it('is resolved to "undefined"', async () => {
        await expect(returnValue)
          .resolves
          .toBe(undefined);
      });

      it('triggers callback for each file and directory in source directory tree', async () => {
        await returnValue;

        expect(fsEntries.every((fsEntry) => fsEntry instanceof FsEntry)).toBe(true);
        expect(fsEntries).toEqual(expectedFsEntries);
      });
    });

    describe('when callback is rejected for some file or directory in source directory tree', () => {
      let fsEntries;
      let returnValue;

      beforeEach(async () => {
        fsEntries = [];

        returnValue = iterateDirectoryChildren(dirPath, (fsEntry) => {
          fsEntries.push(fsEntry);
          if (fsEntry.name === '.dot_file_added') {
            throw new Error('Test error');
          }
        });
      });

      it('is rejected with corresponding error', async () => {
        await expect(returnValue)
          .rejects
          .toThrow('Test error');
      });

      it("doesn't trigger callback after rejected file or directory", async () => {
        try {
          await returnValue;
        } catch (err) {
          // ignored
        }

        const expectedEntries = expectedFsEntries.filter(({ name }) => name === '.dot_file_added');

        expect(fsEntries).toEqual(expectedEntries);
      });
    });

    describe('when "skipEntryChildrenIteration" is called for some directory', () => {
      it("doesn't trigger callback for children of that directory", async () => {
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
