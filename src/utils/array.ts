// eslint-disable-next-line import/prefer-default-export
export async function iterateInSeries(
  array: any[],
  asyncCallback: (element: any, index?: number) => Promise<void>,
): Promise<void> {
  for (let index = 0; index < array.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await asyncCallback(array[index], index);
  }
}
