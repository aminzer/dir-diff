import validateBooleanArg from './validateBooleanArg';

describe('utils > validations > validateBooleanArg', () => {
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
      argument: true,
      shouldThrow: false,
    },
    {
      argument: false,
      shouldThrow: false,
    },
    {
      argument: 'false',
      shouldThrow: true,
    },
  ];

  testCases.forEach(({ argument, shouldThrow }) => {
    describe(`when input argument is ${argument}`, () => {
      it(`should${shouldThrow ? '' : ' not'} throw error`, () => {
        const callback = () => {
          validateBooleanArg(argument, 'testArg');
        };

        if (shouldThrow) {
          expect(callback).toThrow('"testArg" is not a boolean');
        } else {
          expect(callback).not.toThrow();
        }
      });
    });
  });
});
