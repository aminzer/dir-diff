import { join, sep } from 'node:path';
import expectedSourceEntries from '../../../test/resources/common/expected_source_fs_entries';
import expectedTargetEntries from '../../../test/resources/common/expected_target_fs_entries';
import { FsEntry } from '@aminzer/traverse-directory';
import compareDirectories from '../compareDirectories';

function expectEqualEntries(fsEntries: FsEntry[], expectedFsEntries: FsEntry[]) {
  expect(fsEntries.every((fsEntry) => fsEntry instanceof FsEntry)).toBe(true);

  expect(fsEntries).toEqual(expectedFsEntries);
}

describe('compareDirectories', () => {
  describe('when source path does not exist', () => {
    const sourceDirPath = join(__dirname, 'invalid/path');
    const targetDirPath = __dirname;

    it('is rejected with error', async () => {
      await expect(compareDirectories(sourceDirPath, targetDirPath)).rejects.toThrow(
        `Source directory "${sourceDirPath}" does not exist`,
      );
    });
  });

  describe('when target path does not exist', () => {
    const sourceDirPath = __dirname;
    const targetDirPath = join(__dirname, 'invalid/path');

    it('is rejected with error', async () => {
      await expect(compareDirectories(sourceDirPath, targetDirPath)).rejects.toThrow(
        `Target directory "${targetDirPath}" does not exist`,
      );
    });
  });

  describe('when source path corresponds to a file', () => {
    const sourceDirPath = __filename;
    const targetDirPath = __dirname;

    it('is rejected with error', async () => {
      await expect(compareDirectories(sourceDirPath, targetDirPath)).rejects.toThrow(
        `Source directory "${sourceDirPath}" does not exist`,
      );
    });
  });

  describe('when target path corresponds to a file', () => {
    const sourceDirPath = __dirname;
    const targetDirPath = __filename;

    it('is rejected with error', async () => {
      await expect(compareDirectories(sourceDirPath, targetDirPath)).rejects.toThrow(
        `Target directory "${targetDirPath}" does not exist`,
      );
    });
  });

  describe('when both paths corresponds to directories', () => {
    const sourceDirPath = join(__dirname, '../../../test/resources/common/source');
    const targetDirPath = join(__dirname, '../../../test/resources/common/target');

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
        expect(await compareDirectories(sourceDirPath, targetDirPath)).toBe(undefined);
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
        __dirname,
        '../../../test/resources/file_and_dir_equal_name/source',
      );
      const targetDirPathForCurrentCase = join(
        __dirname,
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

        expect(sourceOnlyEntries.length).toBe(1);
        expect(sourceOnlyEntries[0].name).toBe(commonName);
        expect(sourceOnlyEntries[0].absolutePath).toBe(
          join(sourceDirPathForCurrentCase, commonName),
        );
        expect(sourceOnlyEntries[0].relativePath).toBe(commonName);
        expect(sourceOnlyEntries[0].isFile).toBe(false);
        expect(sourceOnlyEntries[0].size).toBe(0);

        expect(targetOnlyEntries.length).toBe(1);
        expect(targetOnlyEntries[0].name).toBe(commonName);
        expect(targetOnlyEntries[0].absolutePath).toBe(
          join(targetDirPathForCurrentCase, commonName),
        );
        expect(targetOnlyEntries[0].relativePath).toBe(commonName);
        expect(targetOnlyEntries[0].isFile).toBe(true);
        expect(targetOnlyEntries[0].size).toBe(0);
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
        await expect(returnValue).rejects.toThrow('Test error');
      });

      it("doesn't trigger callback after rejected file or directory", async () => {
        try {
          await returnValue;
        } catch {
          // ignored
        }

        expect(fsEntries).toEqual(expectedSourceEntries);
      });
    });
  });
});
