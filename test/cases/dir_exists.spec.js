const { isDirExist } = require('../../src/utils/fs');

describe('dirExist', () => {
  describe('when path does not exist', () => {
    it('returns false', async () => {
      expect(await isDirExist(`${__dirname}/wrong/path`)).toBe(false);
    });
  });

  describe('when path corresponds to file', () => {
    it('returns false', async () => {
      expect(await isDirExist(__filename)).toBe(false);
    });
  });

  describe('when path corresponds to directory', () => {
    it('returns true', async () => {
      expect(await isDirExist(__dirname)).toBe(true);
    });
  });
});
