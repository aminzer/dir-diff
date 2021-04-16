class FsEntry {
  constructor({
    name,
    absolutePath,
    relativePath,
    isFile,
    size,
  } = {}) {
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

module.exports = FsEntry;
