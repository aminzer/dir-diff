import assert from 'node:assert';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import areFileContentsEqual from '../areFileContentsEqual.js';

const getFilePath = (fileName: string): string =>
  join(import.meta.dirname, `../../../../test/resources/common/${fileName}`);

describe('utils > fs > areFileContentsEqual', () => {
  describe('when files have equal contents', () => {
    const filePath1 = getFilePath('source/file3.txt');
    const filePath2 = getFilePath('target/file3.txt');

    it('returns true', async () => {
      assert.strictEqual(await areFileContentsEqual(filePath1, filePath2), true);
    });
  });

  describe('when files have different contents', () => {
    const filePath1 = getFilePath('source/file3.txt');
    const filePath2 = getFilePath('target/file4.txt');

    it('returns false', async () => {
      assert.strictEqual(await areFileContentsEqual(filePath1, filePath2), false);
    });
  });
});
