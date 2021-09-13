"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const validations_1 = require("../validations");
function validateArgs({ sourcePath, targetPath, onEachEntry, onAddedEntry, onModifiedEntry, onRemovedEntry, skipContentComparison, skipExtraIterations, }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, validations_1.validateDirPathArg)(sourcePath, 'Source directory');
        yield (0, validations_1.validateDirPathArg)(targetPath, 'Target directory');
        (0, validations_1.validateFunctionArg)(onEachEntry, 'onEachEntry');
        (0, validations_1.validateFunctionArg)(onAddedEntry, 'onAddedEntry');
        (0, validations_1.validateFunctionArg)(onModifiedEntry, 'onModifiedEntry');
        (0, validations_1.validateFunctionArg)(onRemovedEntry, 'onRemovedEntry');
        (0, validations_1.validateBooleanArg)(skipContentComparison, 'skipContentComparison');
        (0, validations_1.validateBooleanArg)(skipExtraIterations, 'skipExtraIterations');
    });
}
exports.default = validateArgs;
