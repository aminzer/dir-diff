class FsEntry {
  constructor({ name, absolutePath, relativePath, isFile, size }) {
    this.name = name;
    this.absolutePath = absolutePath;
    this.relativePath = relativePath;
    this.isFile = isFile;
    this.size = size;
  }

  get isDirectory() {
    return !this.isFile;
  }
}

module.exports = FsEntry;
