const { validateBooleanArg, validateDirPathArg, validateFunctionArg } = require('../validations');

async function validateArgs({
  sourcePath,
  targetPath,
  onEachEntry,
  onAddedEntry,
  onModifiedEntry,
  onRemovedEntry,
  skipContentComparison,
  skipExtraIterations,
}) {
  await validateDirPathArg(sourcePath, 'Source directory');
  await validateDirPathArg(targetPath, 'Target directory');

  validateFunctionArg(onEachEntry, 'onEachEntry');
  validateFunctionArg(onAddedEntry, 'onAddedEntry');
  validateFunctionArg(onModifiedEntry, 'onModifiedEntry');
  validateFunctionArg(onRemovedEntry, 'onRemovedEntry');

  validateBooleanArg(skipContentComparison, 'skipContentComparison');
  validateBooleanArg(skipExtraIterations, 'skipExtraIterations');
}

module.exports = validateArgs;
