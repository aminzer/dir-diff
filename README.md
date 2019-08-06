### Overview

Utility for recursive directory comparison.

### Installation

```
npm install @aminzer/dir-diff
```

### Usage Example

```javascript
const dirDiff = require('@aminzer/dir-diff');

dirDiff('d:/work', 'e:/backups/work', {
  onAddedEntry: ({ absolutePath }) => console.log(`added ${absolutePath}`),
  onModifiedEntry: ({ absolutePath }) => console.log(`modified ${absolutePath}`),
  onRemovedEntry: ({ absolutePath }) => console.log(`removed ${absolutePath}`),
})
  .then(() => console.log('Directories are compared'))
  .catch(err => console.log(`Error occurred: ${err.message}`));

```

### Description

```javascript
dirDiff(sourcePath, targetPath, opts)
```

##### Return value

`dirDiff` returns `Promise`, which become fulfilled when directory comparison is finished.

##### Parameters

* `sourcePath` (`String`, required) - path to the source directory.
* `targetPath` (`String`, required) - path to the target directory.
* `opts` (`Object`, optional) - additional options to pass:
    * `onAddedEntry` (`function`, `null` by default) - function that is called for files and directories that are present in source directory, but are absent in target directory. `FsEntry` instance is passed as parameter.
    * `onModifiedEntry` (`function`, `null` by default) - function that is called for files that are present in both source and target directories but have different content. `FsEntry` instance is passed as parameter.
    * `onRemovedEntry` (`function`, `null` by default) - function that is called for files and directories that are absent in source directory, but are present in target directory. `FsEntry` instance is passed as parameter.
    * `onEachEntry` (`function`, `null` by default) - function that is called for all files and directories from both source and target directories. `FsEntry` instance is passed as parameter.
    * `skipContentComparison` (`boolean`, `false` by default) - files are compared by size only. Content comparison is skipped. It speeds up execution by avoiding "expensive" content-comparison process for large amount of data.
    * `skipExtraIterations` (`boolean`, `false` by default) - child-entries of added/removed directories are not considered. It speeds up execution by avoiding recursive calls for such directories.

##### FsEntry

`FsEntry` - class representing file or directory. Instance properties:

* `name` - name of entry.
* `absolutePath` - absolute path to entry.
* `relativePath` - relative path to entry. It's relative to source directory for `added` or `modified` entries and relative to target directory for `removed` entries.
* `size` - size of file in bytes, `0` for directories.
* `isFile` - `true` if entry is file.
* `isDirectory` - `true` if entry is directory.
