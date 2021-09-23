import { validateBooleanArg, validateDirPathArg, validateFunctionArg } from '../validations';

export default async function validateArgs(
  sourceDirPath: any,
  targetDirPath: any,
  onEachEntry: any,
  onSourceOnlyEntry: any,
  onTargetOnlyEntry: any,
  onDifferentEntries: any,
  skipContentComparison: any,
  skipExcessNestedIterations: any,
) {
  await validateDirPathArg(sourceDirPath, 'Source directory');
  await validateDirPathArg(targetDirPath, 'Target directory');

  validateFunctionArg(onEachEntry, 'onEachEntry');
  validateFunctionArg(onSourceOnlyEntry, 'onSourceOnlyEntry');
  validateFunctionArg(onTargetOnlyEntry, 'onTargetOnlyEntry');
  validateFunctionArg(onDifferentEntries, 'onDifferentEntries');

  validateBooleanArg(skipContentComparison, 'skipContentComparison');
  validateBooleanArg(skipExcessNestedIterations, 'skipExcessNestedIterations');
}
