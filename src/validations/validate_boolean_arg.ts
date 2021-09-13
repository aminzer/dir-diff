import { isBoolean } from '../utils/type';

export default function validateBooleanArg(arg, argName) {
  if (!isBoolean(arg)) {
    throw new Error(`"${argName}" is not a boolean`);
  }
}
