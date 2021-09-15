import * as fs from 'fs';
import * as util from 'util';
import * as streamEqual from 'stream-equal';

export const readdir = util.promisify(fs.readdir);
export const stat = util.promisify(fs.stat);

export async function isDirExist(path: string): Promise<boolean> {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch (err) {
    return false;
  }
}

export async function areFileContentsEqual(filePath1: string, filePath2: string): Promise<boolean> {
  const stream1 = fs.createReadStream(filePath1);
  const stream2 = fs.createReadStream(filePath2);

  return streamEqual(stream1, stream2);
}
