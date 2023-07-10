import { isNil, isFunction } from '../typeChecks';

const validateFunctionArg = (
  arg: unknown,
  argName: string,
  { isRequired = false }: { isRequired?: boolean } = {},
): void => {
  if (isNil(arg) && !isRequired) {
    return;
  }

  if (!isFunction(arg)) {
    throw new Error(`"${argName}" is not a function`);
  }
};

export default validateFunctionArg;
