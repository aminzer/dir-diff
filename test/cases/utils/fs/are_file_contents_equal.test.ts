import * as path from 'path';
import { areFileContentsEqual } from '../../../../dist/utils/fs';

function getFilePath(fileName: string): string {
  return path.join(__dirname, `../../../resources/common/${fileName}`);
}

describe('areFileContentsEqual', () => {
  describe('when files have equal contents', () => {
    const filePath1 = getFilePath('source/file3.txt');
    const filePath2 = getFilePath('target/file3.txt');

    it('returns true', async () => {
      expect(await areFileContentsEqual(filePath1, filePath2)).toBe(true);
    });
  });

  describe('when files have different contents', () => {
    const filePath1 = getFilePath('source/file3.txt');
    const filePath2 = getFilePath('target/file4.txt');

    it('returns true', async () => {
      expect(await areFileContentsEqual(filePath1, filePath2)).toBe(false);
    });
  });
});
