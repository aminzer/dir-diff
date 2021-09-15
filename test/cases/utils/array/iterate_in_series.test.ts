import { iterateInSeries } from '../../../../dist/utils/array';

describe('iterateInSeries', () => {
  it('resolved to undefined', async () => {
    const returnValue = await iterateInSeries([], () => {});

    expect(returnValue).toBe(undefined);
  });

  it('calls async callback in series for each array element', async () => {
    let buffer = '';

    await iterateInSeries(['a', 'b', 'c'], async (element: string, index: number) => {
      buffer += `${element}${index}.`;
    });

    expect(buffer).toBe('a0.b1.c2.');
  });
});
