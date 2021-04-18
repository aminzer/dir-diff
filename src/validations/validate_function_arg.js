const { isNullish, isFunction } = require('../utils/type');

function validateFunctionArg(arg, argName, { isRequired = false } = {}) {
  if (isNullish(arg) && !isRequired) {
    return;
  }

  if (!isFunction(arg)) {
    throw new Error(`"${argName}" is not a function`);
  }
}

module.exports = validateFunctionArg;
