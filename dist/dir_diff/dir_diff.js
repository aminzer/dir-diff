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
const iterate_dir_children_1 = require("../iterate_dir_children");
const get_target_fs_entry_1 = require("./get_target_fs_entry");
const fs_1 = require("../utils/fs");
const validate_args_1 = require("./validate_args");
function dirDiff(sourcePath, targetPath, { onEachEntry = null, onAddedEntry = null, onModifiedEntry = null, onRemovedEntry = null, skipContentComparison = false, skipExtraIterations = false, } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, validate_args_1.default)({
            sourcePath,
            targetPath,
            onEachEntry,
            onAddedEntry,
            onModifiedEntry,
            onRemovedEntry,
            skipContentComparison,
            skipExtraIterations,
        });
        yield (0, iterate_dir_children_1.default)(sourcePath, (sourceFsEntry, { skipEntryIteration }) => __awaiter(this, void 0, void 0, function* () {
            if (onEachEntry) {
                yield onEachEntry(sourceFsEntry);
            }
            const targetFsEntry = yield (0, get_target_fs_entry_1.default)(sourceFsEntry, targetPath);
            if (targetFsEntry === null) {
                if (onAddedEntry) {
                    yield onAddedEntry(sourceFsEntry);
                }
                if (skipExtraIterations) {
                    skipEntryIteration();
                }
                return;
            }
            if (sourceFsEntry.isDirectory || !onModifiedEntry) {
                return;
            }
            if (sourceFsEntry.size !== targetFsEntry.size) {
                yield onModifiedEntry(sourceFsEntry);
                return;
            }
            if (!skipContentComparison && !(yield (0, fs_1.isContentEqual)(sourceFsEntry, targetFsEntry))) {
                yield onModifiedEntry(sourceFsEntry);
            }
        }));
        if (!onEachEntry && !onRemovedEntry) {
            return;
        }
        yield (0, iterate_dir_children_1.default)(targetPath, (targetFsEntry, { skipEntryIteration }) => __awaiter(this, void 0, void 0, function* () {
            if (onEachEntry) {
                yield onEachEntry(targetFsEntry);
            }
            const sourceFsEntry = yield (0, get_target_fs_entry_1.default)(targetFsEntry, sourcePath);
            if (sourceFsEntry === null) {
                if (onRemovedEntry) {
                    yield onRemovedEntry(targetFsEntry);
                }
                if (skipExtraIterations) {
                    skipEntryIteration();
                }
            }
        }));
    });
}
exports.default = dirDiff;
