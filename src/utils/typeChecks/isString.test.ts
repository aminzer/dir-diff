import isString from './isString';

describe('utils > typeChecks > isString', () => {
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
      expectedResult: true,
    },
    {
      value: 'a',
      expectedResult: true,
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
      expectedResult: false,
    },
    {
      value: () => 1,
      expectedResult: false,
    },
  ];

  testCases.forEach(({ value, expectedResult }) => {
    describe(`when input value is ${value}`, () => {
      it(`returns ${expectedResult}`, () => {
        expect(isString(value)).toBe(expectedResult);
      });
    });
  });
});
