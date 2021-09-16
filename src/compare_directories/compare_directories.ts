import iterateDirChildren from '../iterate_dir_children';
import getMirroredFsEntry from './get_mirrored_fs_entry';
import { areFileContentsEqual } from '../utils/fs';
import validateArgs from './validate_args';

export default async function compareDirectories(
  sourcePath: string,
  targetPath: string, {
    onEachEntry = null,
    onSourceOnlyEntry = null,
    onTargetOnlyEntry = null,
    onDifferentEntries = null,
    skipContentComparison = false,
    skipExcessNestedIterations = false,
  } = {},
) {
  await validateArgs({
    sourcePath,
    targetPath,
    onEachEntry,
    onSourceOnlyEntry,
    onTargetOnlyEntry,
    onDifferentEntries,
    skipContentComparison,
    skipExcessNestedIterations,
  });

  await iterateDirChildren(sourcePath, async (sourceFsEntry, { skipEntryIteration }) => {
    if (onEachEntry) {
      await onEachEntry(sourceFsEntry);
    }

    const targetFsEntry = await getMirroredFsEntry(sourceFsEntry, targetPath);

    if (!targetFsEntry) {
      if (onSourceOnlyEntry) {
        await onSourceOnlyEntry(sourceFsEntry);
      }

      if (skipExcessNestedIterations) {
        skipEntryIteration();
      }

      return;
    }

    if (sourceFsEntry.isDirectory || !onDifferentEntries) {
      return;
    }

    if (sourceFsEntry.size !== targetFsEntry.size) {
      await onDifferentEntries(sourceFsEntry, targetFsEntry);
      return;
    }

    if (skipContentComparison) {
      return;
    }

    if (!await areFileContentsEqual(sourceFsEntry.absolutePath, targetFsEntry.absolutePath)) {
      await onDifferentEntries(sourceFsEntry, targetFsEntry);
    }
  });

  if (!onEachEntry && !onTargetOnlyEntry) {
    return;
  }

  await iterateDirChildren(targetPath, async (targetFsEntry, { skipEntryIteration }) => {
    if (onEachEntry) {
      await onEachEntry(targetFsEntry);
    }

    const sourceFsEntry = await getMirroredFsEntry(targetFsEntry, sourcePath);

    if (!sourceFsEntry) {
      if (onTargetOnlyEntry) {
        await onTargetOnlyEntry(targetFsEntry);
      }

      if (skipExcessNestedIterations) {
        skipEntryIteration();
      }
    }
  });
}
