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
const path = require("path");
const models_1 = require("../models");
const array_1 = require("../utils/array");
const fs_1 = require("../utils/fs");
function iterateDirChildrenRecursive(absoluteDirPath, relativeDirPath, onEachChild) {
    return __awaiter(this, void 0, void 0, function* () {
        const entries = yield (0, fs_1.readdir)(absoluteDirPath);
        yield (0, array_1.iterateInSeries)(entries, (name) => __awaiter(this, void 0, void 0, function* () {
            const absolutePath = path.join(absoluteDirPath, name);
            const relativePath = relativeDirPath ? path.join(relativeDirPath, name) : name;
            const stats = yield (0, fs_1.stat)(absolutePath);
            const isFile = stats.isFile();
            const size = isFile ? stats.size : 0;
            const fsEntry = new models_1.FsEntry({
                name,
                absolutePath,
                relativePath,
                isFile,
                size,
            });
            let iterateEntry = fsEntry.isDirectory;
            const skipEntryIteration = () => {
                iterateEntry = false;
            };
            yield onEachChild(fsEntry, { skipEntryIteration });
            if (iterateEntry) {
                yield iterateDirChildrenRecursive(absolutePath, relativePath, onEachChild);
            }
        }));
    });
}
exports.default = iterateDirChildrenRecursive;
