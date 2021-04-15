const path = require('path');

module.exports = [{
  relativePath: 'file3.txt', name: 'file3.txt', isFile: true, size: 0,
}, {
  relativePath: 'file4.txt', name: 'file4.txt', isFile: true, size: 0,
}, {
  relativePath: 'file5_modified_content.txt', name: 'file5_modified_content.txt', isFile: true, size: 44,
}, {
  relativePath: 'file6_removed.txt', name: 'file6_removed.txt', isFile: true, size: 0,
}, {
  relativePath: 'subdir2', name: 'subdir2', isFile: false, size: 0,
}, {
  relativePath: 'subdir2/file21.txt', name: 'file21.txt', isFile: true, size: 0,
}, {
  relativePath: 'subdir2/file23_modified_size.txt', name: 'file23_modified_size.txt', isFile: true, size: 35,
}, {
  relativePath: 'subdir2/file24_removed.txt', name: 'file24_removed.txt', isFile: true, size: 0,
}, {
  relativePath: 'subdir2/subdir21', name: 'subdir21', isFile: false, size: 0,
}, {
  relativePath: 'subdir2/subdir21/file211.txt', name: 'file211.txt', isFile: true, size: 0,
}, {
  relativePath: 'subdir2/subdir21/file213_modified_content.txt', name: 'file213_modified_content.txt', isFile: true, size: 44,
}, {
  relativePath: 'subdir3_removed', name: 'subdir3_removed', isFile: false, size: 0,
}, {
  relativePath: 'subdir3_removed/file31_removed.txt', name: 'file31_removed.txt', isFile: true, size: 0,
}].map((fsEntry) => ({
  ...fsEntry,
  relativePath: path.join(fsEntry.relativePath),
  absolutePath: path.join(__dirname, 'target', fsEntry.relativePath),
}));
