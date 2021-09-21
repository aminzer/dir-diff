// eslint-disable-next-line import/prefer-default-export
export async function iterateInSeries<Type>(
  array: Type[],
  callback: (element: Type, index?: number) => void | Promise<void>,
): Promise<void> {
  for (let index = 0; index < array.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[index], index);
  }
}
