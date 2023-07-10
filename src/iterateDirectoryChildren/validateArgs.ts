import { validateDirPathArg, validateFunctionArg } from '../utils/validations';

const validateArgs = async (dirPath: unknown, onEachChild: unknown): Promise<void> => {
  await validateDirPathArg(dirPath, 'Directory');

  validateFunctionArg(onEachChild, 'onEachChild', {
    isRequired: true,
  });
};

export default validateArgs;
