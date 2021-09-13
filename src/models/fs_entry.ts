export default class FsEntry {
  name;

  absolutePath;

  relativePath;

  isFile;

  size;

  constructor({
    name = null,
    absolutePath = null,
    relativePath = null,
    isFile = null,
    size = null,
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
