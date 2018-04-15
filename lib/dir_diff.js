const fs = require('fs');
const contentHash = require('md5-file').sync;

const dirExists = require('./dir_exists');
const FsEntry = require('./fs_entry');
const iterateDirChildren = require('./iterate_dir_children');

function dirDiff(sourcePath, targetPath, opts = {}) {
  const {
    skipRemoved = false,
    skipModified = false,
    skipContentComparison = false,
    skipExtraIterations = false,
    onEachEntry = null
  } = opts;

  if (!dirExists(sourcePath)) throw new Error(`Directory "${sourcePath}" does not exist`);
  if (!dirExists(targetPath)) throw new Error(`Directory "${targetPath}" does not exist`);

  const addedEntries = [];
  const modifiedEntries = [];
  const removedEntries = [];

  iterateDirChildren(sourcePath, (sourceFsEntry, skipEntryIteration) => {
    onEachEntry && onEachEntry(sourceFsEntry);

    const targetFsEntry = mirrorFsEntry(sourceFsEntry, targetPath);

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

    if (!skipContentComparison && !equalContent(sourceFsEntry, targetFsEntry)) {
      modifiedEntries.push(sourceFsEntry);
    }
  });

  !skipRemoved && iterateDirChildren(targetPath, (targetFsEntry, skipEntryIteration) => {
    onEachEntry && onEachEntry(targetFsEntry);

    const sourceFsEntry = mirrorFsEntry(targetFsEntry, sourcePath);

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

function mirrorFsEntry(fsEntry, mirrorRootPath) {
  const mirrorFsEntryPath = mirrorRootPath + '/' + fsEntry.relativePath;
  if (!fs.existsSync(mirrorFsEntryPath)) {
    return null;
  }

  const mirrorFsEntryStat = fs.statSync(mirrorFsEntryPath);
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
}

function equalContent(fileEntry1, fileEntry2) {
  return contentHash(fileEntry1.absolutePath) === contentHash(fileEntry2.absolutePath);
}

module.exports = dirDiff;
