const fs = require('fs');
const streamEqual = require('stream-equal');
const { stat } = require('../utils/fs_promisified');
const dirExists = require('./dir_exists');
const FsEntry = require('./fs_entry');
const iterateDirChildren = require('./iterate_dir_children');

async function dirDiff(sourcePath, targetPath, opts = {}) {
  const {
    onAddedEntry = null,
    onModifiedEntry = null,
    onRemovedEntry = null,
    onEachEntry = null,
    skipContentComparison = false,
    skipExtraIterations = false,
  } = opts;

  if (!await dirExists(sourcePath)) {
    throw new Error(`Source directory "${sourcePath}" does not exist`);
  }

  if (!await dirExists(targetPath)) {
    throw new Error(`Target directory "${targetPath}" does not exist`);
  }

  await iterateDirChildren(sourcePath, async (sourceFsEntry, { skipEntryIteration }) => {
    if (onEachEntry) {
      await onEachEntry(sourceFsEntry);
    }

    const targetFsEntry = await mirrorFsEntry(sourceFsEntry, targetPath);

    if (targetFsEntry === null) {
      if (onAddedEntry) {
        await onAddedEntry(sourceFsEntry);
      }

      if (skipExtraIterations) {
        skipEntryIteration();
      }

      return;
    }

    if (sourceFsEntry.isDirectory || !onModifiedEntry) {
      return;
    }

    if (sourceFsEntry.size !== targetFsEntry.size) {
      await onModifiedEntry(sourceFsEntry);
      return;
    }

    if (!skipContentComparison && !await equalContent(sourceFsEntry, targetFsEntry)) {
      await onModifiedEntry(sourceFsEntry);
    }
  });

  if (!onEachEntry && !onRemovedEntry) {
    return;
  }

  await iterateDirChildren(targetPath, async (targetFsEntry, { skipEntryIteration }) => {
    if (onEachEntry) {
      await onEachEntry(targetFsEntry);
    }

    const sourceFsEntry = await mirrorFsEntry(targetFsEntry, sourcePath);

    if (sourceFsEntry === null) {
      if (onRemovedEntry) {
        await onRemovedEntry(targetFsEntry);
      }

      if (skipExtraIterations) {
        skipEntryIteration();
      }
    }
  });
}

async function mirrorFsEntry(fsEntry, mirrorRootPath) {
  try {
    const mirrorFsEntryPath = mirrorRootPath + '/' + fsEntry.relativePath;
    const mirrorFsEntryStats = await stat(mirrorFsEntryPath);

    if (fsEntry.isFile !== mirrorFsEntryStats.isFile()) {
      return null;
    }

    return new FsEntry({
      name: fsEntry.name,
      absolutePath: mirrorFsEntryPath,
      relativePath: fsEntry.relativePath,
      isFile: mirrorFsEntryStats.isFile(),
      size: mirrorFsEntryStats.size
    });

  } catch (err) {
    return null;
  }
}

async function equalContent(fileEntry1, fileEntry2) {
  const stream1 = fs.createReadStream(fileEntry1.absolutePath);
  const stream2 = fs.createReadStream(fileEntry2.absolutePath);

  return streamEqual(stream1, stream2);
}

module.exports = dirDiff;
