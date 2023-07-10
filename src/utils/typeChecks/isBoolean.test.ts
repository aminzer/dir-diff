import isBoolean from './isBoolean';

describe('utils > typeChecks > isBoolean', () => {
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
      expectedResult: true,
    },
    {
      value: true,
      expectedResult: true,
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
        expect(isBoolean(value)).toBe(expectedResult);
      });
    });
  });
});
