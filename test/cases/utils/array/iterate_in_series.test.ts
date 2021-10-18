import { iterateInSeries } from '../../../../dist/utils/array';

describe('iterateInSeries', () => {
  describe('when callback is executed without rejections for each element', () => {
    let buffer = '';
    let returnValue;

    beforeEach(async () => {
      buffer = '';

      returnValue = iterateInSeries(['a', 'b', 'c'], async (element: string, index: number) => {
        buffer += `${element}${index}.`;
      });
    });

    it('is resolved to "undefined"', async () => {
      await expect(returnValue)
        .resolves
        .toBe(undefined);
    });

    it('triggers callback in series for each array element', async () => {
      await returnValue;

      expect(buffer).toBe('a0.b1.c2.');
    });
  });

  describe('when callback rejects with error for some element', () => {
    let buffer = '';
    let returnValue;

    beforeEach(async () => {
      buffer = '';

      returnValue = iterateInSeries(['a', 'b', 'c'], async (element: string, index: number) => {
        if (element === 'b') {
          throw new Error('Test error');
        }

        buffer += `${element}${index}.`;
      });
    });

    it('is rejected with corresponding error', async () => {
      await expect(returnValue)
        .rejects
        .toThrow('Test error');
    });

    it("doesn't trigger callback after rejected element", async () => {
      try {
        await returnValue;
      } catch (err) {
        // ignored
      }

      expect(buffer).toBe('a0.');
    });
  });
});
