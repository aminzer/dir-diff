const { isNullish, isFunction } = require('../../utils/type');

function validateFunctionArg(arg, argName) {
  if (isNullish(arg)) {
    return;
  }

  if (!isFunction(arg)) {
    throw new Error(`"${argName}" is not a function`);
  }
}

module.exports = validateFunctionArg;
