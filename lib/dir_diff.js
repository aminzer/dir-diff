const contentHash = require('md5-file/promise');
const { stat } = require('../utils/fs_promisified');

const dirExists = require('./dir_exists');
const FsEntry = require('./fs_entry');
const iterateDirChildren = require('./iterate_dir_children');

async function dirDiff(sourcePath, targetPath, opts = {}) {
  const {
    skipRemoved = false,
    skipModified = false,
    skipContentComparison = false,
    skipExtraIterations = false,
    onEachEntry = null
  } = opts;

  if (!await dirExists(sourcePath)) throw new Error(`Directory "${sourcePath}" does not exist`);
  if (!await dirExists(targetPath)) throw new Error(`Directory "${targetPath}" does not exist`);

  const addedEntries = [];
  const modifiedEntries = [];
  const removedEntries = [];

  await iterateDirChildren(sourcePath, async (sourceFsEntry, skipEntryIteration) => {
    onEachEntry && await onEachEntry(sourceFsEntry);

    const targetFsEntry = await mirrorFsEntry(sourceFsEntry, targetPath);

    if (targetFsEntry === null) {
      addedEntries.push(sourceFsEntry);
      skipExtraIterations && skipEntryIteration();
      return;
    }

    if (skipModified || sourceFsEntry.isDirectory) {
      return;
    }

    if (sourceFsEntry.size !== targetFsEntry.size) {
      modifiedEntries.push(sourceFsEntry);
      return;
    }

    if (!skipContentComparison && !await equalContent(sourceFsEntry, targetFsEntry)) {
      modifiedEntries.push(sourceFsEntry);
    }
  });

  !skipRemoved && await iterateDirChildren(targetPath, async (targetFsEntry, skipEntryIteration) => {
    onEachEntry && onEachEntry(targetFsEntry);

    const sourceFsEntry = await mirrorFsEntry(targetFsEntry, sourcePath);

    if (sourceFsEntry === null) {
      removedEntries.push(targetFsEntry);
      skipExtraIterations && skipEntryIteration();
    }
  });

  return {
    added: addedEntries,
    modified: modifiedEntries,
    removed: removedEntries
  };
}

async function mirrorFsEntry(fsEntry, mirrorRootPath) {
  try {
    const mirrorFsEntryPath = mirrorRootPath + '/' + fsEntry.relativePath;
    const mirrorFsEntryStat = await stat(mirrorFsEntryPath);

    if (fsEntry.isFile !== mirrorFsEntryStat.isFile()) {
      return null;
    }

    return new FsEntry({
      name: fsEntry.name,
      absolutePath: mirrorFsEntryPath,
      relativePath: fsEntry.relativePath,
      isFile: mirrorFsEntryStat.isFile(),
      size: mirrorFsEntryStat.size
    });

  } catch (e) {
    return null;
  }
}

async function equalContent(fileEntry1, fileEntry2) {
  return await contentHash(fileEntry1.absolutePath) === await contentHash(fileEntry2.absolutePath);
}

module.exports = dirDiff;
