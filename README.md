### Overview

[NodeJS](https://nodejs.org) utility for recursive directory iteration and comparison.

### Installation

```
npm i @aminzer/dir-diff
```

### Usage examples

##### Directory iteration

```javascript
const { iterateDirectoryChildren } = require('@aminzer/dir-diff');

await iterateDirectoryChildren('d:/work', (fsEntry) => {
  console.log(`${fsEntry.isFile ? 'File' : 'Directory'} ${fsEntry.relativePath} was found`);
});
```

##### Directory comparison

```javascript
const { compareDirectories } = require('@aminzer/dir-diff');

await compareDirectories('d:/work', 'e:/backups/work', {
  onSourceOnlyEntry: (fsEntry) => {
   console.log(`${fsEntry.isFile ? 'File' : 'Directory'} ${fsEntry.relativePath} exists in the source directory only`);
  },
  onTargetOnlyEntry: (fsEntry) => {
   console.log(`${fsEntry.isFile ? 'File' : 'Directory'} ${fsEntry.relativePath} exists in the target directory only`);
  },
  onDifferentEntries: (sourceFsEntry, targetFsEntry) => {
   console.log(`File ${sourceFsEntry.relativePath} exists in both source and target directories, but with different content`);
  },
});
```

### API

**iterateDirectoryChildren**

##### Overview

`iterateDirectoryChildren` is used for recursive iteration of directory children.


```javascript
iterateDirectoryChildren(dirPath, onEachChild);
```

##### Parameters

* `dirPath` (`string`, required) - path to the directory which children should be iterated.
* `onEachChild` (`function`, required) - callback that is called for each child file and directory.

`onEachChild` callback accepts following arguments:
* `fsEntry` (`FsEntry`) - currently iterated child file or directory.
* `additionalArgs` (`object`, optional) - additional callback arguments:
    * `skipEntryChildrenIteration` (`function`) - if this function is called within `onEachChild` function then iteration of entry children will be skipped.

##### Return value

`Promise` that becomes fulfilled when directory children iteration is completed.

**compareDirectories**

##### Overview

`compareDirectories` is used for recursive comparison of 2 directories.

```javascript
compareDirectories(sourceDirPath, targetDirPath, opts)
```

##### Parameters

* `sourceDirPath` (`string`, required) - path to the source directory.
* `targetDirPath` (`string`, required) - path to the target directory.
* `opts` (`object`, optional) - additional options to pass:
    * `onSourceOnlyEntry` (`function`, `null` by default) - function that is called for files and directories that are present in source directory, but are missing in target directory. Corresponding `FsEntry` instance is passed as parameter.
    * `onTargetOnlyEntry` (`function`, `null` by default) - function that is called for files and directories that are missing in source directory, but are present in target directory. Corresponding `FsEntry` instance is passed as parameter.
    * `onDifferentEntries` (`function`, `null` by default) - function that is called for files that are present in both source and target directories but have different content. Corresponding `FsEntry` instances are passed as parameters.
    * `onEachEntry` (`function`, `null` by default) - function that is called for all files and directories from both source and target directories. Corresponding `FsEntry` instance is passed as parameter.
    * `skipContentComparison` (`boolean`, `false` by default) - files are compared by size only. Content comparison is skipped. It speeds up execution by avoiding "expensive" content-comparison process for large files.
    * `skipExcessNestedIterations` (`boolean`, `false` by default) - children of added/removed directories are not considered. It speeds up execution by avoiding recursive calls for such directories.

##### Return value

`Promise` that becomes fulfilled when directory comparison is completed.

**FsEntry**

##### Overview

`FsEntry` - class representing File System Entry (file or directory).

```javascript
const { FsEntry } =  require('@aminzer/dir-diff');
```

Instance properties:
* `name` (`string`) - name of entry.
* `absolutePath` (`string`) - absolute path to entry.
* `relativePath` (`string`) - relative path to entry. It's relative to source directory for `source` entries and relative to target directory for `target` entries.
* `size` (`number`) - size of file in bytes, `0` for directories.
* `isFile` (`boolean`) - `true` if entry is file.
* `isDirectory` (`boolean`) - `true` if entry is directory.

### Command line tool

[@aminzer/dir-diff-cli](https://www.npmjs.com/package/@aminzer/dir-diff-cli)
