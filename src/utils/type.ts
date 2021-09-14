export function isNullish(value: any): boolean {
  return value === undefined || value === null;
}

export function isFunction(value: any): boolean {
  return typeof value === 'function';
}

export function isBoolean(value: any): boolean {
  return typeof value === 'boolean';
}
