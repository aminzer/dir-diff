const { FsEntry } = require('../models');
const { stat } = require('../utils/fs');

async function getTargetFsEntry(sourceFsEntry, targetRootPath) {
  try {
    const targetFsEntryPath = `${targetRootPath}/${sourceFsEntry.relativePath}`;
    const targetFsEntryStats = await stat(targetFsEntryPath);

    if (sourceFsEntry.isFile !== targetFsEntryStats.isFile()) {
      return null;
    }

    return new FsEntry({
      name: sourceFsEntry.name,
      absolutePath: targetFsEntryPath,
      relativePath: sourceFsEntry.relativePath,
      isFile: targetFsEntryStats.isFile(),
      size: targetFsEntryStats.size,
    });
  } catch (err) {
    return null;
  }
}

module.exports = getTargetFsEntry;
