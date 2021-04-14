const dirDiff = require('../lib/dir_diff');
const FsEntry = require('../lib/fs_entry');
const expectedSourceEntries = require('./resources/source_fs_entries');
const expectedTargetEntries = require('./resources/target_fs_entries');
const { writeFile, unlink, mkdir, rmdir } = require('../utils/fs_promisified');

describe('dirDiff', () => {
  describe('when at least one path does not exist', () => {
    const wrongPath = __dirname + '/wrong/path';

    it('throws error', async () => {
      await expect(dirDiff(wrongPath, __dirname)).rejects.toThrow();
      await expect(dirDiff(__dirname, wrongPath)).rejects.toThrow();
    });
  });

  describe('when at least one path corresponds to file', () => {
    it('throws error', async () => {
      await expect(dirDiff(__filename, __dirname)).rejects.toThrow();
      await expect(dirDiff(__dirname, __filename)).rejects.toThrow();
    });
  });

  describe('when both paths corresponds to directories', () => {
    const sourcePath = __dirname + '/resources/source';
    const targetPath = __dirname + '/resources/target';

    const expectedAddedEntries = expectedSourceEntries.filter(({ name }) => name.includes('added'));
    const expectedModifiedEntries = expectedSourceEntries.filter(({ name }) => name.includes('modified'));
    const expectedRemovedEntries = expectedTargetEntries.filter(({ name }) => name.includes('removed'));

    describe('when no additional options are passed', () => {
      it('returns fulfilled Promise', async () => {
        await expect(dirDiff(sourcePath, targetPath)).resolves.toBe(undefined);
      });
    });

    describe('when "onEachEntry" option is passed', () => {
      it('triggers "onEachEntry" for each file/directory from both source and target directories', async () => {
        const entriesPassedToOnEachEntry = [];
        await dirDiff(sourcePath, targetPath, {
          onEachEntry: fsEntry => entriesPassedToOnEachEntry.push(fsEntry)
        });

        expectEqualEntries(entriesPassedToOnEachEntry, [...expectedSourceEntries, ...expectedTargetEntries]);
      });
    });

    describe('when "onAddedEntry" option is passed', () => {
      it('triggers "onAddedEntry" for each file/directory that exists in source directory and doesn\'t exist in target directory', async () => {
        const entriesPassedToOnAddedEntry = [];
        await dirDiff(sourcePath, targetPath, {
          onAddedEntry: fsEntry => entriesPassedToOnAddedEntry.push(fsEntry)
        });

        expectEqualEntries(entriesPassedToOnAddedEntry, expectedAddedEntries);
      });
    });

    describe('when "onModifiedEntry" option is passed', () => {
      it('triggers "onModifiedEntry" for each file that exists in both source and target directories, but has different content', async () => {
        const entriesPassedToOnModifiedEntry = [];
        await dirDiff(sourcePath, targetPath, {
          onModifiedEntry: fsEntry => entriesPassedToOnModifiedEntry.push(fsEntry)
        });

        expectEqualEntries(entriesPassedToOnModifiedEntry, expectedModifiedEntries);
      });
    });

    describe('when "onRemovedEntry" option is passed', () => {
      it('triggers "onRemovedEntry" for each file/directory that doesn\'t exist in source directory and exists in target directory', async () => {
        const entriesPassedToOnRemovedEntry = [];
        await dirDiff(sourcePath, targetPath, {
          onRemovedEntry: fsEntry => entriesPassedToOnRemovedEntry.push(fsEntry)
        });

        expectEqualEntries(entriesPassedToOnRemovedEntry, expectedRemovedEntries);
      });
    });

    describe('when "skipContentComparison" option is set to true', () => {
      it('doesn\'t trigger "onModifiedEntry" for files with preserved size but changed content', async () => {
        const entriesPassedToOnModifiedEntry = [];
        await dirDiff(sourcePath, targetPath, {
          onModifiedEntry: fsEntry => entriesPassedToOnModifiedEntry.push(fsEntry),
          skipContentComparison: true
        });

        expectEqualEntries(entriesPassedToOnModifiedEntry, expectedModifiedEntries.filter(({ name }) => !name.includes('_modified_content')));
      });
    });

    describe('when "skipExtraIterations" option is set to true', () => {
      it('doesn\'t trigger "onAddedEntry" for children of added directories', async () => {
        const entriesPassedToOnAddedEntry = [];
        await dirDiff(sourcePath, targetPath, {
          onAddedEntry: fsEntry => entriesPassedToOnAddedEntry.push(fsEntry),
          skipExtraIterations: true
        });

        expectEqualEntries(entriesPassedToOnAddedEntry, expectedAddedEntries.filter(({ relativePath }) => !relativePath.includes('_added/')));
      });

      it('doesn\'t trigger "onRemovedEntry" for children of removed directories', async () => {
        const entriesPassedToOnRemovedEntry = [];
        await dirDiff(sourcePath, targetPath, {
          onRemovedEntry: fsEntry => entriesPassedToOnRemovedEntry.push(fsEntry),
          skipExtraIterations: true
        });

        expectEqualEntries(entriesPassedToOnRemovedEntry, expectedRemovedEntries.filter(({ relativePath }) => !relativePath.includes('_removed/')));
      });
    });

    describe('when entries have same name but different types (file/directory)', () => {
      const commonName = 'file_or_dir';
      const dirPath = sourcePath + '/' + commonName;
      const filePath = targetPath + '/' + commonName;

      it('differs such entries', async () => {
        try {
          await mkdir(dirPath);
          await writeFile(filePath, '');

          let addedDir = null;
          let removedFile = null;

          await dirDiff(sourcePath, targetPath, {
            onAddedEntry: fsEntry => {
              if (fsEntry.name === commonName) {
                addedDir = fsEntry;
              }
            },
            onRemovedEntry: fsEntry => {
              if (fsEntry.name === commonName) {
                removedFile = fsEntry;
              }
            },
          });

          expect(addedDir instanceof FsEntry).toBe(true);
          expect(addedDir.isDirectory).toBe(true);

          expect(removedFile instanceof FsEntry).toBe(true);
          expect(removedFile.isDirectory).toBe(false);

        } finally {
          try {
            await rmdir(dirPath);
          } catch (err) { }

          try {
            await unlink(filePath);
          } catch (err) { }
        }
      });
    });
  });
});

function expectEqualEntries(fsEntries, expectedFsEntries) {
  expect(fsEntries.every(fsEntry => fsEntry instanceof FsEntry)).toBe(true);

  expect(fsEntries).toEqual(expectedFsEntries);
}
