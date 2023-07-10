import * as path from 'path';
import isDirExist from './isDirExist';

describe('utils > fs > dirExist', () => {
  describe('when path does not exist', () => {
    const invalidPath = path.join(__dirname, 'invalid/path');

    it('returns false', async () => {
      expect(await isDirExist(invalidPath)).toBe(false);
    });
  });

  describe('when path corresponds to file', () => {
    const filePath = __filename;

    it('returns false', async () => {
      expect(await isDirExist(filePath)).toBe(false);
    });
  });

  describe('when path corresponds to directory', () => {
    const dirPath = __dirname;

    it('returns true', async () => {
      expect(await isDirExist(dirPath)).toBe(true);
    });
  });
});
