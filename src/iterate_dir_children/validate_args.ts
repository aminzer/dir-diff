import { validateDirPathArg, validateFunctionArg } from '../validations';

export default async function validateArgs(dirPath, onEachChild) {
  await validateDirPathArg(dirPath, 'Directory');

  validateFunctionArg(onEachChild, 'onEachChild', {
    isRequired: true,
  });
}
