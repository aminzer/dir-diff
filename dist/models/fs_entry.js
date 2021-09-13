"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FsEntry {
    constructor({ name = null, absolutePath = null, relativePath = null, isFile = null, size = null, } = {}) {
        this.name = name;
        this.absolutePath = absolutePath;
        this.relativePath = relativePath;
        this.isFile = isFile;
        this.size = size;
    }
    get isDirectory() {
        return !this.isFile;
    }
    set isDirectory(isDirectory) {
        this.isFile = !isDirectory;
    }
}
exports.default = FsEntry;
