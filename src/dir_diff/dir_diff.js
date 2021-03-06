const iterateDirChildren = require('../iterate_dir_children');
const getTargetFsEntry = require('./get_target_fs_entry');
const { isContentEqual } = require('../utils/fs');
const validateArgs = require('./validate_args');

async function dirDiff(sourcePath, targetPath, {
  onEachEntry = null,
  onAddedEntry = null,
  onModifiedEntry = null,
  onRemovedEntry = null,
  skipContentComparison = false,
  skipExtraIterations = false,
} = {}) {
  await validateArgs({
    sourcePath,
    targetPath,
    onEachEntry,
    onAddedEntry,
    onModifiedEntry,
    onRemovedEntry,
    skipContentComparison,
    skipExtraIterations,
  });

  await iterateDirChildren(sourcePath, async (sourceFsEntry, { skipEntryIteration }) => {
    if (onEachEntry) {
      await onEachEntry(sourceFsEntry);
    }

    const targetFsEntry = await getTargetFsEntry(sourceFsEntry, targetPath);

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

    if (!skipContentComparison && !await isContentEqual(sourceFsEntry, targetFsEntry)) {
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

    const sourceFsEntry = await getTargetFsEntry(targetFsEntry, sourcePath);

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

module.exports = dirDiff;
