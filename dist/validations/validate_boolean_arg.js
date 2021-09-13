"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("../utils/type");
function validateBooleanArg(arg, argName) {
    if (!(0, type_1.isBoolean)(arg)) {
        throw new Error(`"${argName}" is not a boolean`);
    }
}
exports.default = validateBooleanArg;
