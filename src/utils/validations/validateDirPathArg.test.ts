import validateDirPathArg from './validateDirPathArg';

describe('utils > validations > validateDirPathArg', () => {
  interface TestCase {
    argument: unknown;
    shouldThrow: boolean;
  }

  const testCases: TestCase[] = [
    {
      argument: undefined,
      shouldThrow: true,
    },
    {
      argument: null,
      shouldThrow: true,
    },
    {
      argument: __dirname,
      shouldThrow: false,
    },
    {
      argument: __filename,
      shouldThrow: true,
    },
    {
      argument: `${__dirname}/non/existing/path`,
      shouldThrow: true,
    },
  ];

  testCases.forEach(({ argument, shouldThrow }) => {
    describe(`when input argument is ${argument}`, () => {
      it(`should${shouldThrow ? '' : ' not'} throw error`, () => {
        const callback = async () => {
          await validateDirPathArg(argument, 'testArg');
        };

        if (shouldThrow) {
          expect(callback()).rejects.toThrow(`Directory testArg "${argument}" does not exist`);
        } else {
          expect(callback()).resolves.not.toThrow();
        }
      });
    });
  });
});
