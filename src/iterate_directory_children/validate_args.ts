import { validateDirPathArg, validateFunctionArg } from '../validations';

export default async function validateArgs(dirPath: any, onEachChild: any) {
  await validateDirPathArg(dirPath, 'Directory');

  validateFunctionArg(onEachChild, 'onEachChild', {
    isRequired: true,
  });
}
