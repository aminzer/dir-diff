import isFunction from './isFunction';

describe('utils > typeChecks > isFunction', () => {
  interface TestCase {
    value: unknown;
    expectedResult: boolean;
  }

  const testCases: TestCase[] = [
    {
      value: undefined,
      expectedResult: false,
    },
    {
      value: null,
      expectedResult: false,
    },
    {
      value: '',
      expectedResult: false,
    },
    {
      value: 'a',
      expectedResult: false,
    },
    {
      value: 0,
      expectedResult: false,
    },
    {
      value: 1,
      expectedResult: false,
    },
    {
      value: false,
      expectedResult: false,
    },
    {
      value: true,
      expectedResult: false,
    },
    {
      value: [],
      expectedResult: false,
    },
    {
      value: [1],
      expectedResult: false,
    },
    {
      value: {},
      expectedResult: false,
    },
    {
      value: { x: 1 },
      expectedResult: false,
    },
    {
      value: () => undefined,
      expectedResult: true,
    },
    {
      value: () => 1,
      expectedResult: true,
    },
  ];

  testCases.forEach(({ value, expectedResult }) => {
    describe(`when input value is ${value}`, () => {
      it(`returns ${expectedResult}`, () => {
        expect(isFunction(value)).toBe(expectedResult);
      });
    });
  });
});
