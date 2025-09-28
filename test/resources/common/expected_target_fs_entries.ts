import { FsEntry } from '@aminzer/traverse-directory';
import { join, sep } from 'node:path';

export default [
  {
    relativePath: 'file3.txt',
    name: 'file3.txt',
    isFile: true,
    size: 9,
  },
  {
    relativePath: 'file4.txt',
    name: 'file4.txt',
    isFile: true,
    size: 9,
  },
  {
    relativePath: 'file5_modified_content.txt',
    name: 'file5_modified_content.txt',
    isFile: true,
    size: 39,
  },
  {
    relativePath: 'file6_removed.txt',
    name: 'file6_removed.txt',
    isFile: true,
    size: 17,
  },
  {
    relativePath: 'subdir2',
    name: 'subdir2',
    isFile: false,
    size: 0,
  },
  {
    relativePath: `subdir2${sep}file21.txt`,
    name: 'file21.txt',
    isFile: true,
    size: 10,
  },
  {
    relativePath: `subdir2${sep}file23_modified_size.txt`,
    name: 'file23_modified_size.txt',
    isFile: true,
    size: 53,
  },
  {
    relativePath: `subdir2${sep}file24_removed.txt`,
    name: 'file24_removed.txt',
    isFile: true,
    size: 18,
  },
  {
    relativePath: `subdir2${sep}subdir21`,
    name: 'subdir21',
    isFile: false,
    size: 0,
  },
  {
    relativePath: `subdir2${sep}subdir21${sep}file211.txt`,
    name: 'file211.txt',
    isFile: true,
    size: 11,
  },
  {
    relativePath: `subdir2${sep}subdir21${sep}file213_modified_content.txt`,
    name: 'file213_modified_content.txt',
    isFile: true,
    size: 41,
  },
  {
    relativePath: 'subdir3_removed',
    name: 'subdir3_removed',
    isFile: false,
    size: 0,
  },
  {
    relativePath: `subdir3_removed${sep}file31_removed.txt`,
    name: 'file31_removed.txt',
    isFile: true,
    size: 18,
  },
].map(
  (fsEntry) =>
    new FsEntry({
      ...fsEntry,
      absolutePath: join(__dirname, 'target', fsEntry.relativePath),
    }),
);
