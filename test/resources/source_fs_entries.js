const resolvePath = require('../../lib/resolve_path');

module.exports = [
  {relativePath: '.dot_file_added', name: '.dot_file_added', isFile: true, size: 0},
  {relativePath: 'file1_added.txt', name: 'file1_added.txt', isFile: true, size: 0},
  {relativePath: 'file2_added.txt', name: 'file2_added.txt', isFile: true, size: 0},
  {relativePath: 'file3.txt', name: 'file3.txt', isFile: true, size: 0},
  {relativePath: 'file4.txt', name: 'file4.txt', isFile: true, size: 0},
  {relativePath: 'file5_modified_content.txt', name: 'file5_modified_content.txt', isFile: true, size: 44},
  {relativePath: 'subdir1_added', name: 'subdir1_added', isFile: false, size: 0},
  {relativePath: 'subdir1_added/file11_added.txt', name: 'file11_added.txt', isFile: true, size: 0},
  {relativePath: 'subdir2', name: 'subdir2', isFile: false, size: 0},
  {relativePath: 'subdir2/file21.txt', name: 'file21.txt', isFile: true, size: 0},
  {relativePath: 'subdir2/file22_added.txt', name: 'file22_added.txt', isFile: true, size: 0},
  {relativePath: 'subdir2/file23_modified_size.txt', name: 'file23_modified_size.txt', isFile: true, size: 23},
  {relativePath: 'subdir2/subdir21', name: 'subdir21', isFile: false, size: 0},
  {relativePath: 'subdir2/subdir21/file211.txt', name: 'file211.txt', isFile: true, size: 0},
  {relativePath: 'subdir2/subdir21/file212_added.txt', name: 'file212_added.txt', isFile: true, size: 0},
  {relativePath: 'subdir2/subdir21/file213_modified_content.txt', name: 'file213_modified_content.txt', isFile: true, size: 44},
  {relativePath: 'subdir2/subdir22_added', name: 'subdir22_added', isFile: false, size: 0},
  {relativePath: 'subdir2/subdir22_added/file221_added.txt', name: 'file221_added.txt', isFile: true, size: 0}
].map(fsEntry => {
  const absolutePath = resolvePath(__dirname + '/source/' + fsEntry.relativePath);
  return Object.assign(fsEntry, {absolutePath});
});
