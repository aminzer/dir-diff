import { traverseDirectory, FsEntry, directoryExists } from '@aminzer/traverse-directory';
import { areFileContentsEqual } from '../utils/fs';
import getMirroredFsEntry from './getMirroredFsEntry';

const compareDirectories = async (
  sourceDirPath: string,
  targetDirPath: string,
  {
    onEachEntry,
    onSourceOnlyEntry,
    onTargetOnlyEntry,
    onDifferentEntries,
    skipContentComparison,
    skipExcessNestedIterations,
  }: {
    onEachEntry?: (fsEntry: FsEntry) => void | Promise<void>;
    onSourceOnlyEntry?: (fsEntry: FsEntry) => void | Promise<void>;
    onTargetOnlyEntry?: (fsEntry: FsEntry) => void | Promise<void>;
    onDifferentEntries?: (sourceFsEntry: FsEntry, targetFsEntry: FsEntry) => void | Promise<void>;
    skipContentComparison?: boolean;
    skipExcessNestedIterations?: boolean;
  } = {},
): Promise<void> => {
  if (!(await directoryExists(sourceDirPath))) {
    throw new Error(`Source directory "${sourceDirPath}" does not exist`);
  }

  if (!(await directoryExists(targetDirPath))) {
    throw new Error(`Target directory "${targetDirPath}" does not exist`);
  }

  await traverseDirectory(sourceDirPath, async (sourceFsEntry, { skipEntryChildrenIteration }) => {
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

    if (!(await areFileContentsEqual(sourceFsEntry.absolutePath, targetFsEntry.absolutePath))) {
      await onDifferentEntries(sourceFsEntry, targetFsEntry);
    }
  });

  if (!onEachEntry && !onTargetOnlyEntry) {
    return;
  }

  await traverseDirectory(targetDirPath, async (targetFsEntry, { skipEntryChildrenIteration }) => {
    await onEachEntry?.(targetFsEntry);

    const sourceFsEntry = await getMirroredFsEntry(targetFsEntry, sourceDirPath);

    if (!sourceFsEntry) {
      await onTargetOnlyEntry?.(targetFsEntry);

      if (skipExcessNestedIterations) {
        skipEntryChildrenIteration();
      }
    }
  });
};

export default compareDirectories;
