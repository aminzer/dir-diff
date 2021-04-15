const path = require('path');
const validateArgs = require('./validate_args');
const iterateDirChildrenRecursive = require('./iterate_dir_children_recursive');

async function iterateDirChildren(dirPath, onEachChild) {
  const unifiedDirPath = path.join(dirPath);
  await validateArgs(unifiedDirPath, onEachChild);

  await iterateDirChildrenRecursive(unifiedDirPath, null, onEachChild);
}

module.exports = iterateDirChildren;
