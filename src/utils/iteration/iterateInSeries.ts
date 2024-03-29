const iterateInSeries = async <T>(
  array: T[],
  callback: (element: T, index?: number) => void | Promise<void>,
): Promise<void> => {
  for (let index = 0; index < array.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[index], index);
  }
};

export default iterateInSeries;
