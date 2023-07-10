import * as path from 'path';
import { stat } from 'fs/promises';
import { FsEntry } from '../models';

const getMirroredFsEntry = async (
  fsEntry: FsEntry,
  mirrorRootPath: string,
): Promise<FsEntry> => {
  const mirroredFsEntryPath = path.join(mirrorRootPath, fsEntry.relativePath);
  let mirroredFsEntryStats;

  try {
    mirroredFsEntryStats = await stat(mirroredFsEntryPath);
  } catch (err) {
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
