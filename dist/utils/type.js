"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBoolean = exports.isFunction = exports.isNullish = void 0;
function isNullish(value) {
    return value === undefined || value === null;
}
exports.isNullish = isNullish;
function isFunction(value) {
    return typeof value === 'function';
}
exports.isFunction = isFunction;
function isBoolean(value) {
    return typeof value === 'boolean';
}
exports.isBoolean = isBoolean;
