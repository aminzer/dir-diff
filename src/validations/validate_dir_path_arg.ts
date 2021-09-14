import { isDirExist } from '../utils/fs';

export default async function validateDirPathArg(arg: any, argName: string) {
  if (!await isDirExist(arg)) {
    throw new Error(`${argName} "${arg}" does not exist`);
  }
}
