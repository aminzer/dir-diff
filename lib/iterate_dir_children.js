const { stat, readdir } = require('../utils/fs_promisified');
const dirExists = require('./dir_exists');
const FsEntry = require('./fs_entry');
const unifyPath = require('./unify_path');

async function iterateDirChildren(dirPath, onEachChild) {
  const unifiedDirPath = unifyPath(dirPath);
  await validateInputParams(unifiedDirPath, onEachChild);

  await iterateDirChildrenRecursive(unifiedDirPath, null, onEachChild);
}

async function iterateDirChildrenRecursive(absoluteDirPath, relativeDirPath, onEachChild) {
  const entries = await readdir(absoluteDirPath);

  for (let i = 0; i < entries.length; i++) {
    const name = entries[i];
    const absolutePath = absoluteDirPath + '/' + name;
    const relativePath = relativeDirPath ? relativeDirPath + '/' + name : name;

    const stats = await stat(absolutePath);
    const fsEntry = new FsEntry({
      name,
      absolutePath,
      relativePath,
      isFile: stats.isFile(),
      size: stats.size
    });

    let iterateEntry = fsEntry.isDirectory;
    const skipEntryIteration = () => iterateEntry = false;

    await onEachChild(fsEntry, { skipEntryIteration });

    if (iterateEntry) {
      await iterateDirChildrenRecursive(absolutePath, relativePath, onEachChild);
    }
  }
}

async function validateInputParams(dirPath, onEachChild) {
  if (!await dirExists(dirPath)) {
    throw new Error(`Directory "${dirPath}" does not exist`);
  }

  if (typeof onEachChild !== 'function') {
    throw new Error('Second argument must be a function');
  }
}

module.exports = iterateDirChildren;
