import * as path from 'path';
import { FsEntry } from '../models';
import { iterateInSeries } from '../utils/array';
import { stat, readdir } from '../utils/fs';
import { OnEachChild } from './types';

export default async function iterateDirectoryChildrenRecursive(
  absoluteDirPath: string,
  relativeDirPath: string,
  onEachChild: OnEachChild,
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
    const skipEntryChildrenIteration = () => {
      iterateEntry = false;
    };

    await onEachChild(fsEntry, { skipEntryChildrenIteration });

    if (iterateEntry) {
      await iterateDirectoryChildrenRecursive(absolutePath, relativePath, onEachChild);
    }
  });
}
