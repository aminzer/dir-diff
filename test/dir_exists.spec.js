const { expect } = require('./chai');

const dirExist = require('../lib/dir_exists');

describe('dirExist', function () {
  context('when path does not exist', function () {
    it('returns false', function () {
      expect(dirExist(__dirname + '/wrong/path')).to.eventually.be.false;
    });
  });

  context('when path corresponds to file', function () {
    it('returns false', function () {
      expect(dirExist(__filename)).to.eventually.be.false;
    });
  });

  context('when path corresponds to directory', function () {
    it('returns true', function () {
      expect(dirExist(__dirname)).to.eventually.be.true;
    });
  });
});
