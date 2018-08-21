const { stat, readdir } = require('../utils/fs_promisified');

const dirExists = require('./dir_exists');
const FsEntry = require('./fs_entry');
const resolvePath = require('./resolve_path');

async function iterateDirChildren(dirPath, onEachChild) {
  const absoluteDirPath = resolvePath(dirPath);
  await validateInputParams(absoluteDirPath, onEachChild);

  await iterateDirChildrenRecursive(absoluteDirPath, null, onEachChild);
}

async function iterateDirChildrenRecursive(absoluteDirPath, relativeDirPath, onEachChild) {
  const entries = await readdir(absoluteDirPath);

  for (let i = 0; i < entries.length; i++) {
    const name = entries[i];
    const absolutePath = absoluteDirPath + '/' + name;
    const relativePath = relativeDirPath ? relativeDirPath + '/' + name : name;

    const entryStat = await stat(absolutePath);
    const fsEntry = new FsEntry({
      name,
      absolutePath,
      relativePath,
      isFile: entryStat.isFile(),
      size: entryStat.size
    });

    let iterateEntry = fsEntry.isDirectory;
    const skipEntryIteration = () => iterateEntry = false;

    await onEachChild(fsEntry, skipEntryIteration);

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
