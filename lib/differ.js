'use strict';

const jsDiff = require('diff');
const path = require('path');

module.exports = function differ(diff, src, options) {
  var diffPath = path.relative(process.cwd(), src.file);
  var srcPath = path.relative(process.cwd(), diff.file);
  var jsDiffOptions = {
    context: '4'
  };

  var results;

  switch (options.type) {
    case 'changes':
      results = jsDiff.diffLines(src.src, diff.src);
    break;
    case 'hunks':
      results = jsDiff.structuredPatch(diffPath, srcPath, src.src, diff.src, src.header, diff.header, jsDiffOptions).hunks;
    break;
    case 'patch':
    default:
      results = jsDiff.createTwoFilesPatch(diffPath, srcPath, src.src, diff.src, src.header, diff.header, jsDiffOptions);
    break;
  }

  return results;
};
