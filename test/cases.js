'use strict';

const path = require('path');
const async = require('async');
const fs = require('fs');
const should = require('chai').should();

const cases = fs.readdirSync(path.join(__dirname, 'cases'));
const files = ['src.css', 'diff.css', 'output.diff', 'stats.json'];

cases.forEach(function(name) {
  describe('cases/' + name, function() {
    var dir = path.join(__dirname, 'cases', name);

    var paths = files.map(function(file) {
      return path.join(dir, file);
    });

    it('should do stuff', function(done) {
      async.reduce(paths, {}, reduceFiles,
        function processResults(err, results) {
          if (err) {
            done(err);
          } else if (results.stats.ignore) {
            done();
          } else {
            // TODO: validate stats / output
            done();
          }
        }
      );
    });
  });
});

function reduceFiles(memo, file, done) {
  var ext = path.extname(file);
  var name = path.basename(file, ext);

  fs.readFile(file, 'utf8', function(err, results) {
    if (ext === '.json') {
      results = JSON.parse(results);
    }

    memo[name] = results;
    done(err, memo);
  });
}
