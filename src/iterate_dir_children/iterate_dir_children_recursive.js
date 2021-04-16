const path = require('path');
const { FsEntry } = require('../models');
const { iterateInSeries } = require('../utils/array');
const { stat, readdir } = require('../utils/fs');

async function iterateDirChildrenRecursive(absoluteDirPath, relativeDirPath, onEachChild) {
  const entries = await readdir(absoluteDirPath);

  await iterateInSeries(entries, async (name) => {
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
    const skipEntryIteration = () => {
      iterateEntry = false;
    };

    await onEachChild(fsEntry, { skipEntryIteration });

    if (iterateEntry) {
      await iterateDirChildrenRecursive(absolutePath, relativePath, onEachChild);
    }
  });
}

module.exports = iterateDirChildrenRecursive;
