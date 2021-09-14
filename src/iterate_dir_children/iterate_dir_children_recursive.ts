import * as path from 'path';
import { FsEntry } from '../models';
import { iterateInSeries } from '../utils/array';
import { stat, readdir } from '../utils/fs';

export default async function iterateDirChildrenRecursive(
  absoluteDirPath: string,
  relativeDirPath: string,
  onEachChild: (...args) => void,
) {
  const entries = await readdir(absoluteDirPath);

  await iterateInSeries(entries, async (name: string) => {
    const absolutePath = path.join(absoluteDirPath, name);
    const relativePath = relativeDirPath ? path.join(relativeDirPath, name) : name;

    const stats = await stat(absolutePath);
    const isFile = stats.isFile();
    const size = isFile ? stats.size : 0;

    const fsEntry = new FsEntry({
      name,
      absolutePath,
      relativePath,
      isFile,
      size,
    });

    let iterateEntry = fsEntry.isDirectory;
    const skipEntryIteration = () => {
      iterateEntry = false;
    };

    await onEachChild(fsEntry, { skipEntryIteration });

    if (iterateEntry) {
      await iterateDirChildrenRecursive(absolutePath, relativePath, onEachChild);
    }
  });
}
