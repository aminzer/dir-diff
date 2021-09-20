import validateArgs from './validate_args';
import iterateDirChildrenRecursive from './iterate_dir_children_recursive';
import { OnEachChild } from './types';

export default async function iterateDirChildren(
  dirPath: string,
  onEachChild: OnEachChild,
): Promise<void> {
  await validateArgs(dirPath, onEachChild);
  await iterateDirChildrenRecursive(dirPath, null, onEachChild);
}
