import validateArgs from './validate_args';
import iterateDirChildrenRecursive from './iterate_dir_children_recursive';

export default async function iterateDirChildren(dirPath: string, onEachChild: (...args) => void) {
  await validateArgs(dirPath, onEachChild);
  await iterateDirChildrenRecursive(dirPath, null, onEachChild);
}
