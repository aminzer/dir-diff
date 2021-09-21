import validateArgs from './validate_args';
import iterateDirectoryChildrenRecursive from './iterate_directory_children_recursive';
import { OnEachChild } from './types';

export default async function iterateDirectoryChildren(
  dirPath: string,
  onEachChild: OnEachChild,
): Promise<void> {
  await validateArgs(dirPath, onEachChild);
  await iterateDirectoryChildrenRecursive(dirPath, null, onEachChild);
}
