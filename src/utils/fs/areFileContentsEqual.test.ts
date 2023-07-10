import * as path from 'path';
import areFileContentsEqual from './areFileContentsEqual';

const getFilePath = (fileName: string): string => path.join(__dirname, `../../../test/resources/common/${fileName}`);

describe('utils > fs > areFileContentsEqual', () => {
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
