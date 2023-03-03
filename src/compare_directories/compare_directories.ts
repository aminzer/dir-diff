import iterateDirectoryChildren from '../iterate_directory_children';
import { FsEntry } from '../models';
import { areFileContentsEqual } from '../utils/fs';
import getMirroredFsEntry from './get_mirrored_fs_entry';
import validateArgs from './validate_args';

export default async function compareDirectories(
  sourceDirPath: string,
  targetDirPath: string,
  {
    onEachEntry = null,
    onSourceOnlyEntry = null,
    onTargetOnlyEntry = null,
    onDifferentEntries = null,
    skipContentComparison = false,
    skipExcessNestedIterations = false,
  }: {
    onEachEntry?: (fsEntry: FsEntry) => void | Promise<void>,
    onSourceOnlyEntry?: (fsEntry: FsEntry) => void | Promise<void>,
    onTargetOnlyEntry?: (fsEntry: FsEntry) => void | Promise<void>,
    onDifferentEntries?: (sourceFsEntry: FsEntry, targetFsEntry: FsEntry) => void | Promise<void>,
    skipContentComparison?: boolean,
    skipExcessNestedIterations?: boolean,
  } = {},
) {
  await validateArgs(
    sourceDirPath,
    targetDirPath,
    onEachEntry,
    onSourceOnlyEntry,
    onTargetOnlyEntry,
    onDifferentEntries,
    skipContentComparison,
    skipExcessNestedIterations,
  );

  await iterateDirectoryChildren(sourceDirPath, async (sourceFsEntry, {
    skipEntryChildrenIteration,
  }) => {
    await onEachEntry?.(sourceFsEntry);

    const targetFsEntry = await getMirroredFsEntry(sourceFsEntry, targetDirPath);

    if (!targetFsEntry) {
      await onSourceOnlyEntry?.(sourceFsEntry);

      if (skipExcessNestedIterations) {
        skipEntryChildrenIteration();
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

  await iterateDirectoryChildren(targetDirPath, async (targetFsEntry, {
    skipEntryChildrenIteration,
  }) => {
    await onEachEntry?.(targetFsEntry);

    const sourceFsEntry = await getMirroredFsEntry(targetFsEntry, sourceDirPath);

    if (!sourceFsEntry) {
      await onTargetOnlyEntry?.(targetFsEntry);

      if (skipExcessNestedIterations) {
        skipEntryChildrenIteration();
      }
    }
  });
}
