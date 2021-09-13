import * as fs from 'fs';
import * as util from 'util';
import * as streamEqual from 'stream-equal';

export const readdir = util.promisify(fs.readdir);
export const stat = util.promisify(fs.stat);

export async function isDirExist(path) {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch (err) {
    return false;
  }
}

export async function isContentEqual(fileEntry1, fileEntry2) {
  const stream1 = fs.createReadStream(fileEntry1.absolutePath);
  const stream2 = fs.createReadStream(fileEntry2.absolutePath);

  return streamEqual(stream1, stream2);
}
