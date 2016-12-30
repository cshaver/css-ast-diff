'use strict';

const debug = require('debug')('css-ast-diff:cli');
const differ = require('./differ');
const parse = require('css').parse;
const sort = require('./sorters/ast');
const stringify = require('css').stringify;

module.exports = function cssAstDiff(diff, src, callback, options) {
  try {
    debug('parsing...');
    diff.ast = parse(diff.src);
    src.ast = parse(src.src);

    debug('sorting...');
    diff.ast = sort(diff.ast);
    src.ast = sort(src.ast);

    debug('stringifying...');
    diff.src = stringify(diff.ast);
    src.src = stringify(src.ast);

    debug('diffing...');
    var output = differ(diff, src);

    callback(null, output);
  } catch (err) {
    callback(err);
  }
};
