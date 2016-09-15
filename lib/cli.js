'use strict';

const colors = require('colors');
const path = require('path');
const async = require('async');

const optionator = require('./options');
const api = require('./api');

module.exports = (function() {

  const CLI = function(args, callback) {
    this.options = optionator.parse(args);

    this.processFiles();
    this.processVCS();

    async.waterfall([
      this.validate.bind(this),
      this.execute.bind(this),
      this.report.bind(this)
    ], function(err, results) {
      // TODO: better way to handle breaking waterfall without 'real' error
      if (err === true) {
        // error is 'okay'
        console.info(results);
        err = null;
      }
      callback(err, results);
    });
  };

  const proto = CLI.prototype;

  proto.processFiles = function() {
    // files and paths as arrays
    this._files = this.options._;
    this._paths = this.options.absolutePaths ?
      this._files :
      this._files.map(function(file) {
        return path.join(process.cwd(), file);
      });

    this.files = this.options.files = {};
    this.paths = this.options.paths = {};

    // convert files and paths to key/value for easy reading
    this.files.diff = this._files[0];
    this.files.src = this._files[1];

    this.paths.diff = this._paths[0];
    this.paths.src = this._paths[1];
  };

  proto.processVCS = function() {
    if (this.files.src) {
      this.options.git = this.options.svn = false;
    } else {
      this.options.git = !this.options.svn;
      this.options.vcs = this.options.git ? 'git' : 'svn';
    }
  };

  proto.validate = function(callback) {
    var version = 'v' + require('../package.json').version;
    var help = optionator.generateHelp();

    if (this.options.version) {
      // `css-ast-diff -v`
      return callback(true, version);
    } else if (this.options.help || !this._files.length) {
      // `css-ast-diff --help` or `css-ast-diff`
      return callback(true, help);
    } else if (this._files.length > 2) {
      // too many files passed to `css-ast-diff`
      return callback(true, 'Too many arguments.\n\n' + help);
    }

    callback();
  }

  proto.execute = function(callback) {
    if (this.options.vcs) {
      // comparing path and SVN or git
      console.info('\nComparing ' + colors.underline(this.files.diff) + ' to ' + colors.green(this.options.vcs) + ' repo:');
      api.compareVCS(this.paths.diff, this.options.vcs, callback, this.options);
    } else {
      // comparing two paths
      console.info('\nComparing ' + colors.underline(this.files.diff) + ' and ' + colors.underline(this.files.src) + ':');
      api.compareFiles(this.paths.diff, this.paths.src, callback, this.options);
    }
  };

  proto.report = function(results, callback) {
    console.log(results);
    callback();
  };

  return CLI;
})();
