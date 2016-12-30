'use strict';

const path = require('path');
const log = require('./logger');

module.exports = (function() {
  var vcs;
  function svn(file, callback) {
    // if callback isnt passed, return a function expecting a callback
    if (!callback) {
      return function(callback) {
        svn(file, callback);
      };
    } else {
      vcs = require('svn-interface');
      vcs.cat(file, function(err, results) {
        // svn-interface returns '1' on err, so grab the error message from results
        if (err) {
          err = {
            message: results
          };

          callback(err, results);
        }

        var src = {
          src: results,
          file: file
        };

        // get revision number
        vcs.info(file, function(err, results) {
          src.header = results.info.entry._attribute.revision;
          callback(err, src);
        });
      });
    }
  }

  // TODO: check for unborn branches (head does not exist)
  function git(file, callback) {
    // if callback isnt passed, return a function expecting a callback
    if (!callback) {
      return function(callback) {
        git(file, callback);
      };
    } else {
      var src = {
        file: file
      };
      vcs = require('nodegit');
      vcs.Repository.open(process.cwd())
        .then(repo => repo.getHeadCommit())
        .then(commit => {
          src.header = commit.sha().substring(0, 6);
          return commit.getTree();
        })
        .then(tree => tree.getEntry(path.relative(process.cwd(), file)))
        .then(treeEntry =>treeEntry.getBlob())
        .then(blob => {
          src.src = blob.toString();
          callback(null, src);
        })
        .catch(err => {
          callback(err);
        });
    }
  }

  return {
    svn: svn,
    git: git
  };
})();
