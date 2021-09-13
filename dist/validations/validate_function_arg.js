"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("../utils/type");
function validateFunctionArg(arg, argName, { isRequired = false } = {}) {
    if ((0, type_1.isNullish)(arg) && !isRequired) {
        return;
    }
    if (!(0, type_1.isFunction)(arg)) {
        throw new Error(`"${argName}" is not a function`);
    }
}
exports.default = validateFunctionArg;
