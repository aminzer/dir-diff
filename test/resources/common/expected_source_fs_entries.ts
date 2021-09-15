import * as path from 'path';

const separator = path.sep;

export default [{
  relativePath: '.dot_file_added', name: '.dot_file_added', isFile: true, size: 15,
}, {
  relativePath: 'file1_added.txt', name: 'file1_added.txt', isFile: true, size: 15,
}, {
  relativePath: 'file2_added.txt', name: 'file2_added.txt', isFile: true, size: 15,
}, {
  relativePath: 'file3.txt', name: 'file3.txt', isFile: true, size: 9,
}, {
  relativePath: 'file4.txt', name: 'file4.txt', isFile: true, size: 9,
}, {
  relativePath: 'file5_modified_content.txt', name: 'file5_modified_content.txt', isFile: true, size: 39,
}, {
  relativePath: 'subdir1_added', name: 'subdir1_added', isFile: false, size: 0,
}, {
  relativePath: `subdir1_added${separator}file11_added.txt`, name: 'file11_added.txt', isFile: true, size: 16,
}, {
  relativePath: 'subdir2', name: 'subdir2', isFile: false, size: 0,
}, {
  relativePath: `subdir2${separator}file21.txt`, name: 'file21.txt', isFile: true, size: 10,
}, {
  relativePath: `subdir2${separator}file22_added.txt`, name: 'file22_added.txt', isFile: true, size: 16,
}, {
  relativePath: `subdir2${separator}file23_modified_size.txt`, name: 'file23_modified_size.txt', isFile: true, size: 51,
}, {
  relativePath: `subdir2${separator}subdir21`, name: 'subdir21', isFile: false, size: 0,
}, {
  relativePath: `subdir2${separator}subdir21${separator}file211.txt`, name: 'file211.txt', isFile: true, size: 11,
}, {
  relativePath: `subdir2${separator}subdir21${separator}file212_added.txt`, name: 'file212_added.txt', isFile: true, size: 17,
}, {
  relativePath: `subdir2${separator}subdir21${separator}file213_modified_content.txt`, name: 'file213_modified_content.txt', isFile: true, size: 41,
}, {
  relativePath: `subdir2${separator}subdir22_added`, name: 'subdir22_added', isFile: false, size: 0,
}, {
  relativePath: `subdir2${separator}subdir22_added${separator}file221_added.txt`, name: 'file221_added.txt', isFile: true, size: 17,
}].map((fsEntry) => ({
  ...fsEntry,
  absolutePath: path.join(__dirname, 'source', fsEntry.relativePath),
}));
