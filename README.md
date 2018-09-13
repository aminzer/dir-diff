### Overview

Utility for recursive directory comparison.

### Installation

```
npm install @aminzer/dir-diff
```

### Usage Example

```javascript
const dirDiff = require('dir-diff');

dirDiff('/source', '/target')
  .then(diff => {
     console.log('New files and directories:');
     diff.added.forEach(entry => {
       console.log(entry.relativePath);
     });
  });
```

### Description

```javascript
dirDiff(sourcePath, targetPath, opts)
```

##### Return value

`dirDiff` returns `Promise`. Fulfilled value -`Object` in following format:
```
{
  added: Array,
  modified: Array,
  removed: Array
}
```

* `added` - files and directories that are present in source directory, but are absent in target directory.

* `modified` - files that are present in both source and target directories but have different content.

* `removed` - files and directories that are absent in source directory, but are present in target directory.

Arrays corresponding to `added`, `modified` and `removed` keys consist of `FsEntry` instances.

`FsEntry` - class representing file or directory. Instance properties:

* `name` - name of entry.
* `absolutePath` - absolute path to entry.
* `relativePath` - relative path to entry. It's relative to source directory for `added` or `modified` entries and relative to target directory for `removed` entries.
* `size` - size of file in bytes, `0` for directories.
* `isFile` - `true` if entry is file.
* `isDirectory` - `true` if entry is directory.

##### Parameters

* `sourcePath` (`String`, required) - path to the source directory.
* `targetPath` (`String`, required) - path to the target directory.
* `opts` (`Object`, optional) - additional options to pass:
    * `skipRemoved` (`boolean`, `false` by default) - removed files/directories are not considered. It speeds up execution by avoiding recursive iteration of target directory.
    * `skipModified` (`boolean`, `false` by default) - modified files are not considered. It speeds up execution by avoiding file-comparison process.
    * `skipContentComparison` (`boolean`, `false` by default) - files are compared by size only. Content comparison is skipped. It speeds up execution by avoiding "expensive" content-comparison process for large amount of data.
    * `skipExtraIterations` (`boolean`, `false` by default) - child-entries of added/removed directories are not considered. It speeds up execution by avoiding recursive calls for such directories.
    * `onEachEntry` (`function`, `null` by default) - callback that is called on each entry iteration of source and target directories. Iterable `FsEntry` object is passed as parameter.
    
### Command Line Tool

##### Installation

```
npm install -g @aminzer/dir-diff
```

##### Usage Example

```
dir-diff --source "d:/work" --target "f:/backups/work"
```

##### Arguments

* `--source` (`-s`) - path to source directory.
* `--target` (`-t`) - path to target directory.
* `--skip-removed` (`-r`) - enable `skipRemoved` option.
* `--skip-modified` (`-m`) - enable `skipModified` option.
* `--skip-content-comparison` (`-c`) - enable `skipContentComparison` option.
* `--skip-extra-iterations` (`-e`) - enable `skipExtraIterations` option.
* `--trace` - display full stack trace in case of error.
