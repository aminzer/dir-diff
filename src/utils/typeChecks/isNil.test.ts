import isNil from './isNil';

describe('utils > typeChecks > isNil', () => {
  interface TestCase {
    value: unknown;
    expectedResult: boolean;
  }

  const testCases: TestCase[] = [
    {
      value: undefined,
      expectedResult: true,
    },
    {
      value: null,
      expectedResult: true,
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
        expect(isNil(value)).toBe(expectedResult);
      });
    });
  });
});
