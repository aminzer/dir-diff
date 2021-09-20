import { validateBooleanArg, validateDirPathArg, validateFunctionArg } from '../validations';

export default async function validateArgs(
  sourcePath: any,
  targetPath: any,
  onEachEntry: any,
  onSourceOnlyEntry: any,
  onTargetOnlyEntry: any,
  onDifferentEntries: any,
  skipContentComparison: any,
  skipExcessNestedIterations: any,
) {
  await validateDirPathArg(sourcePath, 'Source directory');
  await validateDirPathArg(targetPath, 'Target directory');

  validateFunctionArg(onEachEntry, 'onEachEntry');
  validateFunctionArg(onSourceOnlyEntry, 'onSourceOnlyEntry');
  validateFunctionArg(onTargetOnlyEntry, 'onTargetOnlyEntry');
  validateFunctionArg(onDifferentEntries, 'onDifferentEntries');

  validateBooleanArg(skipContentComparison, 'skipContentComparison');
  validateBooleanArg(skipExcessNestedIterations, 'skipExcessNestedIterations');
}
