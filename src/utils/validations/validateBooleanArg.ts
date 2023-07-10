import { isBoolean } from '../typeChecks';

const validateBooleanArg = (arg: unknown, argName: string): void => {
  if (!isBoolean(arg)) {
    throw new Error(`"${argName}" is not a boolean`);
  }
};

export default validateBooleanArg;
