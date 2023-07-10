import { isDirExist } from '../fs';
import { isString } from '../typeChecks';

const validateDirPathArg = async (arg: unknown, argName: string): Promise<void> => {
  if (!isString(arg) || !await isDirExist(arg)) {
    throw new Error(`Directory ${argName} "${arg}" does not exist`);
  }
};

export default validateDirPathArg;
