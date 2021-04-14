const dirExist = require('../lib/dir_exists');

describe('dirExist', () => {
  describe('when path does not exist', () => {
    it('returns false', async () => {
      expect(await dirExist(__dirname + '/wrong/path')).toBe(false);
    });
  });

  describe('when path corresponds to file', () => {
    it('returns false', async () => {
      expect(await dirExist(__filename)).toBe(false);
    });
  });

  describe('when path corresponds to directory', () => {
    it('returns true', async () => {
      expect(await dirExist(__dirname)).toBe(true);
    });
  });
});
