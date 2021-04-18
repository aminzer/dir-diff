const { validateDirPathArg, validateFunctionArg } = require('../validations');

async function validateArgs(dirPath, onEachChild) {
  await validateDirPathArg(dirPath, 'Directory');

  validateFunctionArg(onEachChild, 'onEachChild', {
    isRequired: true,
  });
}

module.exports = validateArgs;
