import * as path from 'path';
import { FsEntry } from '../models';
import { stat } from '../utils/fs';

export default async function getTargetFsEntry(
  sourceFsEntry: FsEntry,
  targetRootPath: string,
): Promise<FsEntry> {
  try {
    const targetFsEntryPath = path.join(targetRootPath, sourceFsEntry.relativePath);
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
