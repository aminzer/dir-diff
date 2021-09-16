import { validateBooleanArg, validateDirPathArg, validateFunctionArg } from '../validations';

export default async function validateArgs({
  sourcePath,
  targetPath,
  onEachEntry,
  onSourceOnlyEntry,
  onTargetOnlyEntry,
  onDifferentEntries,
  skipContentComparison,
  skipExcessNestedIterations,
}) {
  await validateDirPathArg(sourcePath, 'Source directory');
  await validateDirPathArg(targetPath, 'Target directory');

  validateFunctionArg(onEachEntry, 'onEachEntry');
  validateFunctionArg(onSourceOnlyEntry, 'onSourceOnlyEntry');
  validateFunctionArg(onTargetOnlyEntry, 'onTargetOnlyEntry');
  validateFunctionArg(onDifferentEntries, 'onDifferentEntries');

  validateBooleanArg(skipContentComparison, 'skipContentComparison');
  validateBooleanArg(skipExcessNestedIterations, 'skipExcessNestedIterations');
}
