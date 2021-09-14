import { isBoolean } from '../utils/type';

export default function validateBooleanArg(arg: any, argName: string) {
  if (!isBoolean(arg)) {
    throw new Error(`"${argName}" is not a boolean`);
  }
}
