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

    const allAddedEntries = filterEntries(expectedSourceEntries, 'added');
    const allModifiedEntries = filterEntries(expectedSourceEntries, 'modified');
    const allRemovedEntries = filterEntries(expectedTargetEntries, 'removed');

    context('when no additional options are passed', function () {
      it('returns object with all added, modified and removed files/directories', async function () {
        const diff = await dirDiff(sourcePath, targetPath);
        const expectedDiff = {
          added: allAddedEntries,
          modified: allModifiedEntries,
          removed: allRemovedEntries
        };

        expectEqualDiffs(diff, expectedDiff);
      });
    });

    context('when "skipRemoved" option is set to true', function () {
      it('doesn\'t return removed files/directories', async function () {
        const diff = await dirDiff(sourcePath, targetPath, { skipRemoved: true });
        const expectedDiff = {
          added: allAddedEntries,
          modified: allModifiedEntries,
          removed: []
        };

        expectEqualDiffs(diff, expectedDiff);
      });
    });

    context('when "skipModified" option is set to true', function () {
      it('doesn\'t return modified files', async function () {
        const diff = await dirDiff(sourcePath, targetPath, { skipModified: true });
        const expectedDiff = {
          added: allAddedEntries,
          modified: [],
          removed: allRemovedEntries
        };

        expectEqualDiffs(diff, expectedDiff);
      });
    });

    context('when "skipContentComparison" option is set to true', function () {
      it('doesn\'t return modified files with preserved size but changed content', async function () {
        const diff = await dirDiff(sourcePath, targetPath, { skipContentComparison: true });

        const expectedDiff = {
          added: allAddedEntries,
          modified: allModifiedEntries.filter(fsEntry => !fsEntry.name.includes('_modified_content')),
          removed: allRemovedEntries
        };

        expectEqualDiffs(diff, expectedDiff);
      });
    });

    context('when "skipExtraIterations" option is set to true', function () {
      it('doesn\'t return children of added/removed directories', async function () {
        const diff = await dirDiff(sourcePath, targetPath, { skipExtraIterations: true });

        const expectedDiff = {
          added: allAddedEntries.filter(fsEntry => !fsEntry.relativePath.includes('_added/')),
          modified: allModifiedEntries,
          removed: allRemovedEntries.filter(fsEntry => !fsEntry.relativePath.includes('_removed/'))
        };

        expectEqualDiffs(diff, expectedDiff);
      });
    });

    context('when "onEachEntry" option is passed', function () {
      it('triggers "onEachEntry" for each file/directory from both source and target directories', async function () {
        const entriesPassedToCallback = [];
        await dirDiff(sourcePath, targetPath, {
          onEachEntry: fsEntry => entriesPassedToCallback.push(fsEntry)
        });

        const sourceAndTargetEntries = expectedSourceEntries.slice().concat(expectedTargetEntries);

        expectEqualEntries(entriesPassedToCallback, sourceAndTargetEntries);
      });
    });

    context('when entries have same name but different types (file/directory)', function () {
      const commonName = 'file_or_dir';
      const dirPath = sourcePath + '/' + commonName;
      const filePath = targetPath + '/' + commonName;

      it('differs one from another', async function () {
        try {
          await writeFile(filePath, '');
          await mkdir(dirPath);

          const diff = await dirDiff(sourcePath, targetPath);

          const addedDir = diff.added.find(fsEntry => fsEntry.name === commonName);
          const removedFile = diff.removed.find(fsEntry => fsEntry.name === commonName);

          expect(addedDir).to.be.an.instanceof(FsEntry);
          expect(addedDir.isDirectory).to.be.true;

          expect(removedFile).to.be.an.instanceof(FsEntry);
          expect(removedFile.isDirectory).to.be.false;

        } finally {
          try { await unlink(filePath) } catch(e) {}
          try { await rmdir(dirPath) } catch(e) {}
        }
      });
    });
  });
});

function filterEntries(fsEntries, type) {
  return fsEntries.filter(fsEntry => fsEntry.name.includes(type));
}

function expectEqualDiffs(diff, expectedDiff) {
  expectEqualEntries(diff.added, expectedDiff.added);
  expectEqualEntries(diff.modified, expectedDiff.modified);
  expectEqualEntries(diff.removed, expectedDiff.removed);
}

function expectEqualEntries(fsEntries, expectedFsEntries) {
  fsEntries.forEach(fsEntry => {
    expect(fsEntry).to.be.an.instanceof(FsEntry);
  });

  expect(fsEntries).to.deep.equal(expectedFsEntries);
}
