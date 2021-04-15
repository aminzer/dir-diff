const { isBoolean } = require('../../utils/type');

function validateBooleanArg(arg, argName) {
  if (!isBoolean(arg)) {
    throw new Error(`"${argName}" is not a boolean`);
  }
}

module.exports = validateBooleanArg;
