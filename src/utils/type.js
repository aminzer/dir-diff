function isNullish(value) {
  return value === undefined || value === null;
}

function isFunction(value) {
  return typeof value === 'function';
}

function isBoolean(value) {
  return typeof value === 'boolean';
}

module.exports = {
  isNullish,
  isFunction,
  isBoolean,
};
