import validateFunctionArg from './validateFunctionArg';

describe('utils > validations > validateFunctionArg', () => {
  interface TestCase {
    argument: unknown;
    options?: { isRequired?: boolean };
    shouldThrow: boolean;
  }

  const testCases: TestCase[] = [
    {
      argument: undefined,
      shouldThrow: false,
    },
    {
      argument: undefined,
      options: { isRequired: false },
      shouldThrow: false,
    },
    {
      argument: undefined,
      options: { isRequired: true },
      shouldThrow: true,
    },
    {
      argument: null,
      shouldThrow: false,
    },
    {
      argument: null,
      options: { isRequired: false },
      shouldThrow: false,
    },
    {
      argument: null,
      options: { isRequired: true },
      shouldThrow: true,
    },
    {
      argument: '',
      shouldThrow: true,
    },
    {
      argument: '',
      options: { isRequired: false },
      shouldThrow: true,
    },
    {
      argument: '',
      options: { isRequired: true },
      shouldThrow: true,
    },
    {
      argument: () => undefined,
      shouldThrow: false,
    },
    {
      argument: () => undefined,
      options: { isRequired: false },
      shouldThrow: false,
    },
    {
      argument: () => undefined,
      options: { isRequired: true },
      shouldThrow: false,
    },
  ];

  testCases.forEach(({ argument, options, shouldThrow }) => {
    describe(`when input argument is ${argument} and options are ${JSON.stringify(options)}`, () => {
      it(`should${shouldThrow ? '' : ' not'} throw error`, () => {
        const callback = () => {
          validateFunctionArg(argument, 'testArg', options);
        };

        if (shouldThrow) {
          expect(callback).toThrow('"testArg" is not a function');
        } else {
          expect(callback).not.toThrow();
        }
      });
    });
  });
});
