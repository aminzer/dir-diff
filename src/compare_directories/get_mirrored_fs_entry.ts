import * as path from 'path';
import { FsEntry } from '../models';
import { stat } from '../utils/fs';

export default async function getMirroredFsEntry(
  fsEntry: FsEntry,
  mirrorRootPath: string,
): Promise<FsEntry> {
  try {
    const mirroredFsEntryPath = path.join(mirrorRootPath, fsEntry.relativePath);
    const mirroredFsEntryStats = await stat(mirroredFsEntryPath);

    if (fsEntry.isFile !== mirroredFsEntryStats.isFile()) {
      return null;
    }

    return new FsEntry({
      name: fsEntry.name,
      absolutePath: mirroredFsEntryPath,
      relativePath: fsEntry.relativePath,
      isFile: mirroredFsEntryStats.isFile(),
      size: mirroredFsEntryStats.size,
    });
  } catch (err) {
    return null;
  }
}
