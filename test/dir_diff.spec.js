const { expect } = require('./chai');
const expectedSourceEntries = require('./resources/source_fs_entries');
const expectedTargetEntries = require('./resources/target_fs_entries');
const { writeFile, unlink, mkdir, rmdir } = require('../utils/fs_promisified');

const dirDiff = require('../lib/dir_diff');
const FsEntry = require('../lib/fs_entry');

describe('dirDiff', function () {
  context('when at least one path does not exist', function () {
    const wrongPath = __dirname + '/wrong/path';

    it('throws error', function () {
      expect(dirDiff(wrongPath, __dirname)).to.be.rejected;
      expect(dirDiff(__dirname, wrongPath)).to.be.rejected;
    });
  });

  context('when at least one path corresponds to file', function () {
    it('throws error', function () {
      expect(dirDiff(__filename, __dirname)).to.be.rejected;
      expect(dirDiff(__dirname, __filename)).to.be.rejected;
    });
  });

  context('when both paths corresponds to directories', function () {
    const sourcePath = __dirname + '/resources/source';
    const targetPath = __dirname + '/resources/target';

    const expectedAddedEntries = expectedSourceEntries.filter(({ name }) => name.includes('added'));
    const expectedModifiedEntries = expectedSourceEntries.filter(({ name }) => name.includes('modified'));
    const expectedRemovedEntries = expectedTargetEntries.filter(({ name }) => name.includes('removed'));

    context('when no additional options are passed', function () {
      it('returns fulfilled Promise', async function () {
        expect(dirDiff(sourcePath, targetPath)).to.be.fulfilled;
      });
    });

    context('when "onEachEntry" option is passed', function () {
      it('triggers "onEachEntry" for each file/directory from both source and target directories', async function () {
        const entriesPassedToOnEachEntry = [];
        await dirDiff(sourcePath, targetPath, {
          onEachEntry: fsEntry => entriesPassedToOnEachEntry.push(fsEntry)
        });

        expectEqualEntries(entriesPassedToOnEachEntry, [...expectedSourceEntries, ...expectedTargetEntries]);
      });
    });

    context('when "onAddedEntry" option is passed', function () {
      it('triggers "onAddedEntry" for each file/directory that exists in source directory and doesn\'t exist in target directory', async function () {
        const entriesPassedToOnAddedEntry = [];
        await dirDiff(sourcePath, targetPath, {
          onAddedEntry: fsEntry => entriesPassedToOnAddedEntry.push(fsEntry)
        });

        expectEqualEntries(entriesPassedToOnAddedEntry, expectedAddedEntries);
      });
    });

    context('when "onModifiedEntry" option is passed', function () {
      it('triggers "onModifiedEntry" for each file that exists in both source and target directories, but has different content', async function () {
        const entriesPassedToOnModifiedEntry = [];
        await dirDiff(sourcePath, targetPath, {
          onModifiedEntry: fsEntry => entriesPassedToOnModifiedEntry.push(fsEntry)
        });

        expectEqualEntries(entriesPassedToOnModifiedEntry, expectedModifiedEntries);
      });
    });

    context('when "onRemovedEntry" option is passed', function () {
      it('triggers "onRemovedEntry" for each file/directory that doesn\'t exist in source directory and exists in target directory', async function () {
        const entriesPassedToOnRemovedEntry = [];
        await dirDiff(sourcePath, targetPath, {
          onRemovedEntry: fsEntry => entriesPassedToOnRemovedEntry.push(fsEntry)
        });

        expectEqualEntries(entriesPassedToOnRemovedEntry, expectedRemovedEntries);
      });
    });

    context('when "skipContentComparison" option is set to true', function () {
      it('doesn\'t trigger "onModifiedEntry" for files with preserved size but changed content', async function () {
        const entriesPassedToOnModifiedEntry = [];
        await dirDiff(sourcePath, targetPath, {
          onModifiedEntry: fsEntry => entriesPassedToOnModifiedEntry.push(fsEntry),
          skipContentComparison: true
        });

        expectEqualEntries(entriesPassedToOnModifiedEntry, expectedModifiedEntries.filter(({ name }) => !name.includes('_modified_content')));
      });
    });

    context('when "skipExtraIterations" option is set to true', function () {
      it('doesn\'t trigger "onAddedEntry" for children of added directories', async function () {
        const entriesPassedToOnAddedEntry = [];
        await dirDiff(sourcePath, targetPath, {
          onAddedEntry: fsEntry => entriesPassedToOnAddedEntry.push(fsEntry),
          skipExtraIterations: true
        });

        expectEqualEntries(entriesPassedToOnAddedEntry, expectedAddedEntries.filter(({ relativePath }) => !relativePath.includes('_added/')));
      });

      it('doesn\'t trigger "onRemovedEntry" for children of removed directories', async function () {
        const entriesPassedToOnRemovedEntry = [];
        await dirDiff(sourcePath, targetPath, {
          onRemovedEntry: fsEntry => entriesPassedToOnRemovedEntry.push(fsEntry),
          skipExtraIterations: true
        });

        expectEqualEntries(entriesPassedToOnRemovedEntry, expectedRemovedEntries.filter(({ relativePath }) => !relativePath.includes('_removed/')));
      });
    });

    context('when entries have same name but different types (file/directory)', function () {
      const commonName = 'file_or_dir';
      const dirPath = sourcePath + '/' + commonName;
      const filePath = targetPath + '/' + commonName;

      it('differs such entries', async function () {
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

          expect(addedDir).to.be.an.instanceof(FsEntry);
          expect(addedDir.isDirectory).to.be.true;

          expect(removedFile).to.be.an.instanceof(FsEntry);
          expect(removedFile.isDirectory).to.be.false;

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
  fsEntries.forEach(fsEntry => {
    expect(fsEntry).to.be.an.instanceof(FsEntry);
  });

  expect(fsEntries).to.deep.equal(expectedFsEntries);
}
