const isNil = (value: unknown): value is undefined | null => value === undefined || value === null;

export default isNil;
