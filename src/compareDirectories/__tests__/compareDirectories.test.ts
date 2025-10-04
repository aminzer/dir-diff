import assert from 'node:assert';
import { join, resolve, sep } from 'node:path';
import { beforeEach, describe, it } from 'node:test';
import { FsEntry } from '@aminzer/traverse-directory';
import compareDirectories from '../compareDirectories.js';

const prepareFsEntries = (
  entries: {
    name: string;
    relativePath: string;
    isFile: boolean;
    size: number;
  }[],
  basePath: string,
) =>
  entries.map(
    (options) =>
      new FsEntry({
        ...options,
        absolutePath: join(basePath, options.relativePath),
      }),
  );

const expectedSourceEntries = prepareFsEntries(
  [
    {
      relativePath: '.dot_file_added',
      name: '.dot_file_added',
      isFile: true,
      size: 15,
    },
    {
      relativePath: 'file1_added.txt',
      name: 'file1_added.txt',
      isFile: true,
      size: 15,
    },
    {
      relativePath: 'file2_added.txt',
      name: 'file2_added.txt',
      isFile: true,
      size: 15,
    },
    {
      relativePath: 'file3.txt',
      name: 'file3.txt',
      isFile: true,
      size: 9,
    },
    {
      relativePath: 'file4.txt',
      name: 'file4.txt',
      isFile: true,
      size: 9,
    },
    {
      relativePath: 'file5_modified_content.txt',
      name: 'file5_modified_content.txt',
      isFile: true,
      size: 39,
    },
    {
      relativePath: 'subdir1_added',
      name: 'subdir1_added',
      isFile: false,
      size: 0,
    },
    {
      relativePath: `subdir1_added${sep}file11_added.txt`,
      name: 'file11_added.txt',
      isFile: true,
      size: 16,
    },
    {
      relativePath: 'subdir2',
      name: 'subdir2',
      isFile: false,
      size: 0,
    },
    {
      relativePath: `subdir2${sep}file21.txt`,
      name: 'file21.txt',
      isFile: true,
      size: 10,
    },
    {
      relativePath: `subdir2${sep}file22_added.txt`,
      name: 'file22_added.txt',
      isFile: true,
      size: 16,
    },
    {
      relativePath: `subdir2${sep}file23_modified_size.txt`,
      name: 'file23_modified_size.txt',
      isFile: true,
      size: 51,
    },
    {
      relativePath: `subdir2${sep}subdir21`,
      name: 'subdir21',
      isFile: false,
      size: 0,
    },
    {
      relativePath: `subdir2${sep}subdir21${sep}file211.txt`,
      name: 'file211.txt',
      isFile: true,
      size: 11,
    },
    {
      relativePath: `subdir2${sep}subdir21${sep}file212_added.txt`,
      name: 'file212_added.txt',
      isFile: true,
      size: 17,
    },
    {
      relativePath: `subdir2${sep}subdir21${sep}file213_modified_content.txt`,
      name: 'file213_modified_content.txt',
      isFile: true,
      size: 41,
    },
    {
      relativePath: `subdir2${sep}subdir22_added`,
      name: 'subdir22_added',
      isFile: false,
      size: 0,
    },
    {
      relativePath: `subdir2${sep}subdir22_added${sep}file221_added.txt`,
      name: 'file221_added.txt',
      isFile: true,
      size: 17,
    },
  ],
  resolve(import.meta.dirname, '../../../test/resources/common/source'),
);

const expectedTargetEntries = prepareFsEntries(
  [
    {
      relativePath: 'file3.txt',
      name: 'file3.txt',
      isFile: true,
      size: 9,
    },
    {
      relativePath: 'file4.txt',
      name: 'file4.txt',
      isFile: true,
      size: 9,
    },
    {
      relativePath: 'file5_modified_content.txt',
      name: 'file5_modified_content.txt',
      isFile: true,
      size: 39,
    },
    {
      relativePath: 'file6_removed.txt',
      name: 'file6_removed.txt',
      isFile: true,
      size: 17,
    },
    {
      relativePath: 'subdir2',
      name: 'subdir2',
      isFile: false,
      size: 0,
    },
    {
      relativePath: `subdir2${sep}file21.txt`,
      name: 'file21.txt',
      isFile: true,
      size: 10,
    },
    {
      relativePath: `subdir2${sep}file23_modified_size.txt`,
      name: 'file23_modified_size.txt',
      isFile: true,
      size: 53,
    },
    {
      relativePath: `subdir2${sep}file24_removed.txt`,
      name: 'file24_removed.txt',
      isFile: true,
      size: 18,
    },
    {
      relativePath: `subdir2${sep}subdir21`,
      name: 'subdir21',
      isFile: false,
      size: 0,
    },
    {
      relativePath: `subdir2${sep}subdir21${sep}file211.txt`,
      name: 'file211.txt',
      isFile: true,
      size: 11,
    },
    {
      relativePath: `subdir2${sep}subdir21${sep}file213_modified_content.txt`,
      name: 'file213_modified_content.txt',
      isFile: true,
      size: 41,
    },
    {
      relativePath: 'subdir3_removed',
      name: 'subdir3_removed',
      isFile: false,
      size: 0,
    },
    {
      relativePath: `subdir3_removed${sep}file31_removed.txt`,
      name: 'file31_removed.txt',
      isFile: true,
      size: 18,
    },
  ],
  resolve(import.meta.dirname, '../../../test/resources/common/target'),
);

function expectEqualEntries(fsEntries: FsEntry[], expectedFsEntries: FsEntry[]) {
  assert.ok(fsEntries.every((fsEntry) => fsEntry instanceof FsEntry));

  assert.deepStrictEqual(fsEntries, expectedFsEntries);
}

describe('compareDirectories', () => {
  describe('when source path does not exist', () => {
    const sourceDirPath = join(import.meta.dirname, 'invalid/path');
    const targetDirPath = import.meta.dirname;

    it('is rejected with error', async () => {
      await assert.rejects(() => compareDirectories(sourceDirPath, targetDirPath), {
        message: `Source directory "${sourceDirPath}" does not exist`,
      });
    });
  });

  describe('when target path does not exist', () => {
    const sourceDirPath = import.meta.dirname;
    const targetDirPath = join(import.meta.dirname, 'invalid/path');

    it('is rejected with error', async () => {
      await assert.rejects(() => compareDirectories(sourceDirPath, targetDirPath), {
        message: `Target directory "${targetDirPath}" does not exist`,
      });
    });
  });

  describe('when source path corresponds to a file', () => {
    const sourceDirPath = import.meta.filename;
    const targetDirPath = import.meta.dirname;

    it('is rejected with error', async () => {
      await assert.rejects(() => compareDirectories(sourceDirPath, targetDirPath), {
        message: `Source directory "${sourceDirPath}" does not exist`,
      });
    });
  });

  describe('when target path corresponds to a file', () => {
    const sourceDirPath = import.meta.dirname;
    const targetDirPath = import.meta.filename;

    it('is rejected with error', async () => {
      await assert.rejects(() => compareDirectories(sourceDirPath, targetDirPath), {
        message: `Target directory "${targetDirPath}" does not exist`,
      });
    });
  });

  describe('when both paths corresponds to directories', () => {
    const sourceDirPath = join(import.meta.dirname, '../../../test/resources/common/source');
    const targetDirPath = join(import.meta.dirname, '../../../test/resources/common/target');

    const expectedSourceOnlyEntries = expectedSourceEntries.filter(({ name }) =>
      name.includes('added'),
    );
    const expectedDifferentSourceEntries = expectedSourceEntries.filter(({ name }) =>
      name.includes('modified'),
    );
    const expectedDifferentTargetEntries = expectedTargetEntries.filter(({ name }) =>
      name.includes('modified'),
    );
    const expectedTargetOnlyEntries = expectedTargetEntries.filter(({ name }) =>
      name.includes('removed'),
    );

    describe('when no additional options are passed', () => {
      it('is resolved to "undefined"', async () => {
        assert.strictEqual(await compareDirectories(sourceDirPath, targetDirPath), undefined);
      });
    });

    describe('when "onEachEntry" option is passed', () => {
      it('triggers "onEachEntry" for each file or directory from both source and target directories', async () => {
        const allEntries: FsEntry[] = [];

        await compareDirectories(sourceDirPath, targetDirPath, {
          onEachEntry: (fsEntry) => {
            allEntries.push(fsEntry);
          },
        });

        expectEqualEntries(allEntries, [...expectedSourceEntries, ...expectedTargetEntries]);
      });
    });

    describe('when "onSourceOnlyEntry" option is passed', () => {
      it('triggers "onSourceOnlyEntry" for each file or directory that exists in source directory and doesn\'t exist in target directory', async () => {
        const sourceOnlyEntries: FsEntry[] = [];

        await compareDirectories(sourceDirPath, targetDirPath, {
          onSourceOnlyEntry: (fsEntry) => {
            sourceOnlyEntries.push(fsEntry);
          },
        });

        expectEqualEntries(sourceOnlyEntries, expectedSourceOnlyEntries);
      });
    });

    describe('when "onTargetOnlyEntry" option is passed', () => {
      it('triggers "onTargetOnlyEntry" for each file or directory that doesn\'t exist in source directory and exists in target directory', async () => {
        const targetOnlyEntries: FsEntry[] = [];

        await compareDirectories(sourceDirPath, targetDirPath, {
          onTargetOnlyEntry: (fsEntry) => {
            targetOnlyEntries.push(fsEntry);
          },
        });

        expectEqualEntries(targetOnlyEntries, expectedTargetOnlyEntries);
      });
    });

    describe('when "onDifferentEntries" option is passed', () => {
      it('triggers "onDifferentEntries" for each pair of files that exist in both source and target directories, but have different content', async () => {
        const differentSourceEntries: FsEntry[] = [];
        const differentTargetEntries: FsEntry[] = [];

        await compareDirectories(sourceDirPath, targetDirPath, {
          onDifferentEntries: (sourceFsEntry, targetFsEntry) => {
            differentSourceEntries.push(sourceFsEntry);
            differentTargetEntries.push(targetFsEntry);
          },
        });

        expectEqualEntries(differentSourceEntries, expectedDifferentSourceEntries);
        expectEqualEntries(differentTargetEntries, expectedDifferentTargetEntries);
      });
    });

    describe('when "skipContentComparison" option is set to "true"', () => {
      it('doesn\'t trigger "onDifferentEntries" for pairs of files with equal size but different content', async () => {
        const differentSourceEntries: FsEntry[] = [];
        const differentTargetEntries: FsEntry[] = [];

        await compareDirectories(sourceDirPath, targetDirPath, {
          onDifferentEntries: (sourceFsEntry, targetFsEntry) => {
            differentSourceEntries.push(sourceFsEntry);
            differentTargetEntries.push(targetFsEntry);
          },
          skipContentComparison: true,
        });

        const filterEntries = (expectedEntries: FsEntry[]) =>
          expectedEntries.filter(({ name }) => !name.includes('_modified_content'));

        expectEqualEntries(differentSourceEntries, filterEntries(expectedDifferentSourceEntries));
        expectEqualEntries(differentTargetEntries, filterEntries(expectedDifferentTargetEntries));
      });
    });

    describe('when "skipExcessNestedIterations" option is set to "true"', () => {
      it('doesn\'t trigger "onSourceOnlyEntry" for children of source-only directories', async () => {
        const sourceOnlyEntries: FsEntry[] = [];

        await compareDirectories(sourceDirPath, targetDirPath, {
          onSourceOnlyEntry: (fsEntry) => {
            sourceOnlyEntries.push(fsEntry);
          },
          skipExcessNestedIterations: true,
        });

        const expectedEntries = expectedSourceOnlyEntries.filter(
          ({ relativePath }) => !relativePath.includes(`_added${sep}`),
        );

        expectEqualEntries(sourceOnlyEntries, expectedEntries);
      });

      it('doesn\'t trigger "onTargetOnlyEntry" for children of target-only directories', async () => {
        const targetOnlyEntries: FsEntry[] = [];

        await compareDirectories(sourceDirPath, targetDirPath, {
          onTargetOnlyEntry: (targetFsEntry) => {
            targetOnlyEntries.push(targetFsEntry);
          },
          skipExcessNestedIterations: true,
        });

        const expectedEntries = expectedTargetOnlyEntries.filter(
          ({ relativePath }) => !relativePath.includes(`_removed${sep}`),
        );

        expectEqualEntries(targetOnlyEntries, expectedEntries);
      });
    });

    describe('when entries have same name but different types (file or directory)', () => {
      const commonName = 'file_or_dir.txt';
      const sourceDirPathForCurrentCase = join(
        import.meta.dirname,
        '../../../test/resources/file_and_dir_equal_name/source',
      );
      const targetDirPathForCurrentCase = join(
        import.meta.dirname,
        '../../../test/resources/file_and_dir_equal_name/target',
      );

      it('differs these entries', async () => {
        const sourceOnlyEntries: FsEntry[] = [];
        const targetOnlyEntries: FsEntry[] = [];

        await compareDirectories(sourceDirPathForCurrentCase, targetDirPathForCurrentCase, {
          onSourceOnlyEntry: (fsEntry) => {
            sourceOnlyEntries.push(fsEntry);
          },
          onTargetOnlyEntry: (fsEntry) => {
            targetOnlyEntries.push(fsEntry);
          },
          skipExcessNestedIterations: true,
        });

        assert.strictEqual(sourceOnlyEntries.length, 1);
        assert.strictEqual(sourceOnlyEntries[0].name, commonName);
        assert.strictEqual(
          sourceOnlyEntries[0].absolutePath,
          join(sourceDirPathForCurrentCase, commonName),
        );
        assert.strictEqual(sourceOnlyEntries[0].relativePath, commonName);
        assert.strictEqual(sourceOnlyEntries[0].isFile, false);
        assert.strictEqual(sourceOnlyEntries[0].size, 0);

        assert.strictEqual(targetOnlyEntries.length, 1);
        assert.strictEqual(targetOnlyEntries[0].name, commonName);
        assert.strictEqual(
          targetOnlyEntries[0].absolutePath,
          join(targetDirPathForCurrentCase, commonName),
        );
        assert.strictEqual(targetOnlyEntries[0].relativePath, commonName);
        assert.strictEqual(targetOnlyEntries[0].isFile, true);
        assert.strictEqual(targetOnlyEntries[0].size, 0);
      });
    });

    describe('when "/" is used as path separator in path arguments', () => {
      const getUnixStylePath = (thePath: string) => thePath.replace(/\//g, sep);

      it('triggers callbacks with platform-specific path separator', async () => {
        const entriesPassedToOnEachEntry: FsEntry[] = [];

        await compareDirectories(getUnixStylePath(sourceDirPath), getUnixStylePath(targetDirPath), {
          onEachEntry: (fsEntry) => {
            entriesPassedToOnEachEntry.push(fsEntry);
          },
        });

        expectEqualEntries(entriesPassedToOnEachEntry, [
          ...expectedSourceEntries,
          ...expectedTargetEntries,
        ]);
      });
    });

    describe('when "onEachEntry" is rejected for some file or directory', () => {
      let fsEntries: FsEntry[];
      let returnValue: Promise<void>;

      beforeEach(async () => {
        fsEntries = [];

        returnValue = compareDirectories(sourceDirPath, targetDirPath, {
          onEachEntry: (fsEntry) => {
            if (fsEntry.absolutePath.includes(targetDirPath)) {
              throw new Error('Test error');
            }

            fsEntries.push(fsEntry);
          },
        });
      });

      it('is rejected with corresponding error', async () => {
        await assert.rejects(returnValue, { message: 'Test error' });
      });

      it("doesn't trigger callback after rejected file or directory", async () => {
        try {
          await returnValue;
        } catch {
          // ignored
        }

        assert.deepStrictEqual(fsEntries, expectedSourceEntries);
      });
    });
  });
});
