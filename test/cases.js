'use strict';

const path = require('path');
const async = require('async');
const fs = require('fs');

const chai = require('chai');
const expect = chai.expect;

const cases = fs.readdirSync(path.join(__dirname, 'cases'));
const files = {
  src: 'src.css',
  diff: 'diff.css',
  stats: 'stats.json'
};

const cssAstDiff = require('../lib/api');
const options = {
  type: 'hunks'
};

cases.forEach(function(name) {
  describe('cases/' + name, function() {
    var data = {};

    before(function(done) {
      this.timeout(5000);
      runDiff(name, data, done);
    });

    // TODO: create more useful tests

    it('detects the expected number of changes', function(done) {
      expect(data.changes).to.have.length(data.stats.changes);
      done();
    });
  });
});

function runDiff(name, data, callback) {
  var dir = path.join(__dirname, 'cases', name);
  var src = path.join(dir, files.src);
  var diff = path.join(dir, files.diff);
  var stats = path.join(dir, files.stats);

  async.parallel([
      function readStats(callback) {
        fs.readFile(stats, 'utf8', function(err, results) {
          data.stats = JSON.parse(results);
          callback();
        });
      },
      function createDiff(callback) {
        cssAstDiff.compareFiles(src, diff, function(err, results) {
          if (err) {
            throw err;
          }
          data.changes = results;
          callback();
        }, options);
      }
    ],
    callback
  );
}
