const validateBooleanArg = require('./validate_boolean_arg');
const validateDirPathArg = require('./validate_dir_path_arg');
const validateFunctionArg = require('./validate_function_arg');

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
