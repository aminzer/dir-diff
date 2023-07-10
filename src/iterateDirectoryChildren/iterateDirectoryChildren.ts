import iterateDirectoryChildrenRecursive from './iterateDirectoryChildrenRecursive';
import { OnEachChild } from './types';
import validateArgs from './validateArgs';

const iterateDirectoryChildren = async (
  dirPath: string,
  onEachChild: OnEachChild,
): Promise<void> => {
  await validateArgs(dirPath, onEachChild);
  await iterateDirectoryChildrenRecursive(dirPath, null, onEachChild);
};

export default iterateDirectoryChildren;
