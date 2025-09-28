import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import { FsEntry } from '@aminzer/traverse-directory';

const getMirroredFsEntry = async (
  fsEntry: FsEntry,
  mirrorRootPath: string,
): Promise<FsEntry | null> => {
  const mirroredFsEntryPath = join(mirrorRootPath, fsEntry.relativePath);
  let mirroredFsEntryStats;

  try {
    mirroredFsEntryStats = await stat(mirroredFsEntryPath);
  } catch {
    return null;
  }

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
};

export default getMirroredFsEntry;
