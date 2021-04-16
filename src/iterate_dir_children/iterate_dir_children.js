const validateArgs = require('./validate_args');
const iterateDirChildrenRecursive = require('./iterate_dir_children_recursive');

async function iterateDirChildren(dirPath, onEachChild) {
  await validateArgs(dirPath, onEachChild);
  await iterateDirChildrenRecursive(dirPath, null, onEachChild);
}

module.exports = iterateDirChildren;
