export function isNullish(value) {
  return value === undefined || value === null;
}

export function isFunction(value) {
  return typeof value === 'function';
}

export function isBoolean(value) {
  return typeof value === 'boolean';
}
