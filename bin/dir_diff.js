#!/usr/bin/env node

const parseCmdArgs = require('command-line-args');
const dirDiff = require('../lib/dir_diff');

const log = console.log;
const singleLineLog = require('single-line-log').stdout;

const argDefinitions = [
  {name: 'source', alias: 's', type: String},
  {name: 'target', alias: 't', type: String},
  {name: 'skip-removed', alias: 'r', type: Boolean},
  {name: 'skip-modified', alias: 'm', type: Boolean},
  {name: 'skip-content-comparison', alias: 'c', type: Boolean},
  {name: 'skip-extra-iterations', alias: 'e', type: Boolean},
  {name: 'trace', type: Boolean},
  {name: 'help', type: Boolean}
];

try {
  const args = parseCmdArgs(argDefinitions);

  if (args['help']) {
    const helpMessage =
      '  --source <path>           (-s) : path to the source directory\n' +
      '  --target <path>           (-t) : path to the target directory\n' +
      '  --skip-removed            (-r) : removed files/directories are not considered\n' +
      '  --skip-modified           (-m) : modified files are not considered\n' +
      '  --skip-content-comparison (-c) : files are compared by size only; content comparison is skipped\n' +
      '  --skip-extra-iterations   (-e) : child-entries of added/removed directories are not considered\n' +
      '  --trace                        : show full stack trace in case of error';

    log(helpMessage);
    return;
  }

  const sourceDir = args['source'];
  const targetDir = args['target'];

  if (!sourceDir) throw new Error('Source directory is not set. [ --source <path> ]');
  if (!targetDir) throw new Error('Target directory is not set. [ --target <path> ]');

  const dirDiffOpts = {
    skipRemoved: args['skip-removed'] || false,
    skipModified: args['skip-modified'] || false,
    skipContentComparison: args['skip-content-comparison'] || false,
    skipExtraIterations: args['skip-extra-iterations'] || false
  };

  if (dirDiffOpts.skipModified) {
    dirDiffOpts.skipContentComparison = false;
  }

  log(`Source directory: "${sourceDir}"`);
  log(`Target directory: "${targetDir}"`);

  if (dirDiffOpts.skipRemoved) {
    log(' ! Removed files/directories are not considered. [ --skip-removed ]');
  }
  if (dirDiffOpts.skipModified) {
    log(' ! Modified files are not considered. [ --skip-modified ]');
  }
  if (dirDiffOpts.skipContentComparison) {
    log(' ! Files are compared by size only. Content comparison is skipped. [ --skip-content-comparison ]');
  }
  if (dirDiffOpts.skipExtraIterations) {
    log(' ! Children of added/removed directories are not considered. [ --skip-extra-iterations ]');
  }

  log();
  log('Comparison process is in progress:');

  const ComparisonProgress = {
    fileCount: 0,
    dirCount: 0,
    lastLoggingTime: 0,
    processingEntry: null,

    considerEntry(fsEntry) {
      this.processingEntry = fsEntry;
      fsEntry.isFile ? this.fileCount++ : this.dirCount++;
    },

    logIfNeeded() {
      if (Date.now() - this.lastLoggingTime > 100) {
        this.log();
      }
    },

    log() {
      singleLineLog(this.progressStatus);
      this.lastLoggingTime = Date.now();
    },

    finish() {
      this.processingEntry = null;
      return this;
    },

    get progressStatus() {
      return this.processedStatus + this.processingStatus;
    },

    get processedStatus() {
      return `Processed: ${this.fileCount} files, ${this.dirCount} directories.`;
    },

    get processingStatus() {
      return this.processingEntry ? `\nProcessing: "${this.processingEntry.relativePath}"` : '';
    }
  };

  dirDiffOpts.onEachEntry = fsEntry => {
    ComparisonProgress.considerEntry(fsEntry);
    ComparisonProgress.logIfNeeded();
  };

  const diff = dirDiff(sourceDir, targetDir, dirDiffOpts);

  ComparisonProgress.finish().log();
  log();
  log('Comparison process is finished.');
  log();

  if (diff.added.length === 0 && diff.modified.length === 0 && diff.removed.length === 0) {
    log('Source and target directories have the same content.');
    return;
  }

  log(`added    (+) : ${diff.added.length}`);
  log(`modified (*) : ${dirDiffOpts.skipModified ? 'skipped' : diff.modified.length}`);
  log(`removed  (-) : ${dirDiffOpts.skipRemoved ? 'skipped' : diff.removed.length}`);
  log();

  diff.added.forEach(fsEntry => logFsEntry(fsEntry, '+'));
  diff.modified.forEach(fsEntry => logFsEntry(fsEntry, '*'));
  diff.removed.forEach(fsEntry => logFsEntry(fsEntry, '-'));

} catch (e) {
  const showStackTrace = process.argv.includes('--trace');
  logError(e, showStackTrace);
}

function logFsEntry(fsEntry, icon) {
  const entryType = fsEntry.isDirectory ? 'dir ' : 'file';
  const entryPath = fsEntry.relativePath + (fsEntry.isDirectory ? '/' : '');

  log(`${icon} ${entryType} | ${entryPath}`);
}

function logError(error, showStackTrace) {
  log();
  log('Error occurred!');

  if (showStackTrace) {
    log(error.stack);

  } else {
    log(`${error.name}: ${error.message}`);
    log('Use [ --trace ] option to see full stack trace.');
  }

  log('Use [ --help ] option to see available arguments.');
}
