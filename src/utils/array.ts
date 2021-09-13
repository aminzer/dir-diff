// eslint-disable-next-line import/prefer-default-export
export async function iterateInSeries(array, asyncCallback) {
  for (let index = 0; index < array.length; index += 1) {
    const element = array[index];
    // eslint-disable-next-line no-await-in-loop
    await asyncCallback(element, index);
  }
}
