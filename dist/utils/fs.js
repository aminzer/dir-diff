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
exports.isContentEqual = exports.isDirExist = exports.stat = exports.readdir = void 0;
const fs = require("fs");
const util = require("util");
const streamEqual = require("stream-equal");
exports.readdir = util.promisify(fs.readdir);
exports.stat = util.promisify(fs.stat);
function isDirExist(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const stats = yield (0, exports.stat)(path);
            return stats.isDirectory();
        }
        catch (err) {
            return false;
        }
    });
}
exports.isDirExist = isDirExist;
function isContentEqual(filePath1, filePath2) {
    return __awaiter(this, void 0, void 0, function* () {
        const stream1 = fs.createReadStream(filePath1);
        const stream2 = fs.createReadStream(filePath2);
        return streamEqual(stream1, stream2);
    });
}
exports.isContentEqual = isContentEqual;
