const fs = require('fs');

const dirExists = require('./dir_exists');
const FsEntry = require('./fs_entry');
const resolvePath = require('./resolve_path');

function iterateDirChildren(dirPath, onEachChild) {
  const absoluteDirPath = resolvePath(dirPath);
  validateInputParams(absoluteDirPath, onEachChild);

  return iterateDirChildrenRecursive(absoluteDirPath, null, onEachChild);
}

function iterateDirChildrenRecursive(absoluteDirPath, relativeDirPath, onEachChild) {
  fs.readdirSync(absoluteDirPath).forEach(name => {
    const absolutePath = absoluteDirPath + '/' + name;
    const relativePath = relativeDirPath ? relativeDirPath + '/' + name : name;

    const stat = fs.statSync(absolutePath);
    const fsEntry = new FsEntry({
      name,
      absolutePath,
      relativePath,
      isFile: stat.isFile(),
      size: stat.size
    });

    let iterateEntry = fsEntry.isDirectory;
    const skipEntryIteration = () => iterateEntry = false;

    onEachChild(fsEntry, skipEntryIteration);

    if (iterateEntry) {
      iterateDirChildrenRecursive(absolutePath, relativePath, onEachChild);
    }
  });
}

function validateInputParams(dirPath, onEachChild) {
  if (!dirExists(dirPath)) {
    throw new Error(`Directory "${dirPath}" does not exist`);
  }

  if (typeof onEachChild !== 'function') {
    throw new Error('Second argument must be a function');
  }
}

module.exports = iterateDirChildren;
