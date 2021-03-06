const path = require('path');
const dirDiff = require('../../src');
const { FsEntry } = require('../../src/models');
const expectedSourceEntries = require('../resources/common/source_fs_entries');
const expectedTargetEntries = require('../resources/common/target_fs_entries');

function expectEqualEntries(fsEntries, expectedFsEntries) {
  expect(fsEntries.every((fsEntry) => fsEntry instanceof FsEntry)).toBe(true);

  expect(fsEntries).toEqual(expectedFsEntries);
}

describe('dirDiff', () => {
  describe('when source path does not exist', () => {
    const sourcePath = path.join(__dirname, 'invalid/path');
    const targetPath = __dirname;

    it('throws error', async () => {
      await expect(dirDiff(sourcePath, targetPath))
        .rejects
        .toThrow(`Source directory "${sourcePath}" does not exist`);
    });
  });

  describe('when target path does not exist', () => {
    const sourcePath = __dirname;
    const targetPath = path.join(__dirname, 'invalid/path');

    it('throws error', async () => {
      await expect(dirDiff(sourcePath, targetPath))
        .rejects
        .toThrow(`Target directory "${targetPath}" does not exist`);
    });
  });

  describe('when source path corresponds to a file', () => {
    const sourcePath = __filename;
    const targetPath = __dirname;

    it('throws error', async () => {
      await expect(dirDiff(sourcePath, targetPath))
        .rejects
        .toThrow(`Source directory "${sourcePath}" does not exist`);
    });
  });

  describe('when target path corresponds to a file', () => {
    const sourcePath = __dirname;
    const targetPath = __filename;

    it('throws error', async () => {
      await expect(dirDiff(sourcePath, targetPath))
        .rejects
        .toThrow(`Target directory "${targetPath}" does not exist`);
    });
  });

  describe('when both paths corresponds to directories', () => {
    const sourcePath = path.join(__dirname, '../resources/common/source');
    const targetPath = path.join(__dirname, '../resources/common/target');

    const expectedAddedEntries = expectedSourceEntries.filter(({ name }) => name.includes('added'));
    const expectedModifiedEntries = expectedSourceEntries.filter(({ name }) => name.includes('modified'));
    const expectedRemovedEntries = expectedTargetEntries.filter(({ name }) => name.includes('removed'));

    describe('when no additional options are passed', () => {
      it('returns fulfilled Promise', async () => {
        await expect(dirDiff(sourcePath, targetPath)).resolves.toBe(undefined);
      });
    });

    describe('when "onEachEntry" option is passed', () => {
      it('triggers "onEachEntry" for each file and directory from both source and target directories', async () => {
        const entriesPassedToOnEachEntry = [];

        await dirDiff(sourcePath, targetPath, {
          onEachEntry: (fsEntry) => entriesPassedToOnEachEntry.push(fsEntry),
        });

        expectEqualEntries(entriesPassedToOnEachEntry, [
          ...expectedSourceEntries,
          ...expectedTargetEntries,
        ]);
      });
    });

    describe('when "onAddedEntry" option is passed', () => {
      it('triggers "onAddedEntry" for each file and directory that exists in source directory and doesn\'t exist in target directory', async () => {
        const entriesPassedToOnAddedEntry = [];

        await dirDiff(sourcePath, targetPath, {
          onAddedEntry: (fsEntry) => entriesPassedToOnAddedEntry.push(fsEntry),
        });

        expectEqualEntries(entriesPassedToOnAddedEntry, expectedAddedEntries);
      });
    });

    describe('when "onModifiedEntry" option is passed', () => {
      it('triggers "onModifiedEntry" for each file that exists in both source and target directories, but has different content', async () => {
        const entriesPassedToOnModifiedEntry = [];

        await dirDiff(sourcePath, targetPath, {
          onModifiedEntry: (fsEntry) => entriesPassedToOnModifiedEntry.push(fsEntry),
        });

        expectEqualEntries(entriesPassedToOnModifiedEntry, expectedModifiedEntries);
      });
    });

    describe('when "onRemovedEntry" option is passed', () => {
      it('triggers "onRemovedEntry" for each file and directory that doesn\'t exist in source directory and exists in target directory', async () => {
        const entriesPassedToOnRemovedEntry = [];

        await dirDiff(sourcePath, targetPath, {
          onRemovedEntry: (fsEntry) => entriesPassedToOnRemovedEntry.push(fsEntry),
        });

        expectEqualEntries(entriesPassedToOnRemovedEntry, expectedRemovedEntries);
      });
    });

    describe('when "skipContentComparison" option is set to true', () => {
      it('doesn\'t trigger "onModifiedEntry" for files with preserved size but changed content', async () => {
        const entriesPassedToOnModifiedEntry = [];

        await dirDiff(sourcePath, targetPath, {
          onModifiedEntry: (fsEntry) => entriesPassedToOnModifiedEntry.push(fsEntry),
          skipContentComparison: true,
        });

        const expectedEntries = expectedModifiedEntries.filter(({ name }) => !name.includes('_modified_content'));

        expectEqualEntries(entriesPassedToOnModifiedEntry, expectedEntries);
      });
    });

    describe('when "skipExtraIterations" option is set to true', () => {
      it('doesn\'t trigger "onAddedEntry" for children of added directories', async () => {
        const entriesPassedToOnAddedEntry = [];

        await dirDiff(sourcePath, targetPath, {
          onAddedEntry: (fsEntry) => entriesPassedToOnAddedEntry.push(fsEntry),
          skipExtraIterations: true,
        });

        const pathPartToSkip = path.join('_added/');
        const expectedEntries = expectedAddedEntries.filter(({ relativePath }) => (
          !relativePath.includes(pathPartToSkip)
        ));

        expectEqualEntries(entriesPassedToOnAddedEntry, expectedEntries);
      });

      it('doesn\'t trigger "onRemovedEntry" for children of removed directories', async () => {
        const entriesPassedToOnRemovedEntry = [];

        await dirDiff(sourcePath, targetPath, {
          onRemovedEntry: (fsEntry) => entriesPassedToOnRemovedEntry.push(fsEntry),
          skipExtraIterations: true,
        });

        const pathPartToSkip = path.join('_removed/');
        const expectedEntries = expectedRemovedEntries.filter(({ relativePath }) => (
          !relativePath.includes(pathPartToSkip)
        ));

        expectEqualEntries(entriesPassedToOnRemovedEntry, expectedEntries);
      });
    });

    describe('when entries have same name but different types (file or directory)', () => {
      const commonName = 'file_or_dir.txt';
      const sourcePathForCurrentCase = path.join(__dirname, '../resources/file_and_dir_equal_name/source');
      const targetPathForCurrentCase = path.join(__dirname, '../resources/file_and_dir_equal_name/target');

      it('differs such entries', async () => {
        const entriesPassedToOnAddedEntry = [];
        const entriesPassedToOnRemovedEntry = [];

        await dirDiff(sourcePathForCurrentCase, targetPathForCurrentCase, {
          onAddedEntry: (fsEntry) => entriesPassedToOnAddedEntry.push(fsEntry),
          onRemovedEntry: (fsEntry) => entriesPassedToOnRemovedEntry.push(fsEntry),
          skipExtraIterations: true,
        });

        expect(entriesPassedToOnAddedEntry.length).toBe(1);
        expect(entriesPassedToOnAddedEntry[0]).toEqual({
          name: commonName,
          absolutePath: path.join(sourcePathForCurrentCase, commonName),
          relativePath: commonName,
          isFile: false,
          size: 0,
        });

        expect(entriesPassedToOnRemovedEntry.length).toBe(1);
        expect(entriesPassedToOnRemovedEntry[0]).toEqual({
          name: commonName,
          absolutePath: path.join(targetPathForCurrentCase, commonName),
          relativePath: commonName,
          isFile: true,
          size: 0,
        });
      });
    });

    describe('when "/" is used as path separator in path arguments', () => {
      const replaceSeparators = (thePath) => thePath.replace(/\//g, path.sep);

      it('triggers callbacks with platform-specific path separator', async () => {
        const entriesPassedToOnEachEntry = [];

        await dirDiff(replaceSeparators(sourcePath), replaceSeparators(targetPath), {
          onEachEntry: (fsEntry) => entriesPassedToOnEachEntry.push(fsEntry),
        });

        expectEqualEntries(entriesPassedToOnEachEntry, [
          ...expectedSourceEntries,
          ...expectedTargetEntries,
        ]);
      });
    });
  });
});
