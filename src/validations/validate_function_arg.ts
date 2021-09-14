import { isNullish, isFunction } from '../utils/type';

export default function validateFunctionArg(
  arg: any,
  argName: string,
  { isRequired = false } = {},
) {
  if (isNullish(arg) && !isRequired) {
    return;
  }

  if (!isFunction(arg)) {
    throw new Error(`"${argName}" is not a function`);
  }
}