const { expect } = require('./chai');
const resolvePath = require('../lib/resolve_path');

describe('resolvePath', function () {
  const currentDirPath = __dirname.replace(/\\/g, '/');

  it('replaces backslashes with forward slashes', function () {
    expect(resolvePath(__dirname)).to.eq(currentDirPath);
  });

  it('removes trailing slash', function () {
    expect(resolvePath(__dirname + '/')).to.eq(currentDirPath);
  });

  it('converts relative path into absolute', function () {
    expect(resolvePath('./test')).to.eq(currentDirPath);
  });
});
