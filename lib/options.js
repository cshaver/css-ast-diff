'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const optionator = require('optionator');
const version = require('../package.json').version;
const url = require('../package.json').repository.url;

const hunksExample = {
  hunks: [{
    oldStart: 1,
    oldLines: 3,
    newStart: 1,
    newLines: 3,
    lines: [' line2', ' line3', '-line4', '+line5', '\\ No newline at end of file'],
  }]
};

module.exports = optionator({
  prepend: 'Usage: css-ast-diff [options] file-diff.css [file-source.css]',
  append: 'Version ' + version + '\nDocumentation can be found at ' + url,
  options: [{
    heading: 'Options'
  },
  {
    option: 'version',
    alias: 'v',
    type: 'Boolean',
    description: 'Outputs the version number'
  },
  {
    option: 'help',
    alias: 'h',
    type: 'Boolean',
    description: 'Shows this help menu'
  },
  {
    option: 'debug',
    type: 'Boolean',
    description: 'Show debug messages'
  },
  {
    option: 'git',
    alias: 'g',
    type: 'Boolean',
    default: 'true',
    description: 'Use git as source to generate diff.'
  },
  {
    option: 'svn',
    alias: 's',
    type: 'Boolean',
    default: 'false',
    description: 'Use svn as source to generate diff.'
  },
  {
    option: 'absolute-paths',
    alias: 'a',
    type: 'Boolean',
    default: 'false',
    description: 'Allow files to be passed in with absolute paths.'
  },
  {
    option: 'output',
    alias: 'o',
    type: 'String',
    description: 'Writes diff to file instead of stdout.'
  },
  {
    option: 'type',
    alias: 't',
    type: 'String',
    default: 'patch',
    enum: ['patch', 'hunks', 'changes'],
    description: 'Output type returned.',
    longDescription: [
      'Output type returned. Accepted values are:',
      'patch - returns a block of text as a unified diff patch',
      'changes - returns an array of change objects. See https://github.com/kpdecker/jsdiff#change-objects',
      'hunks - returns an array of hunk objects. For example:',
      JSON.stringify(hunksExample, null, '  ')
    ].join('\n')
  },
  // TODO:
  // {
  //   option: 'prune',
  //   alias: 'p',
  //   type: 'Boolean',
  //   default: 'false',
  //   description: 'Prunes declarations that are overridden.'
  // }
  ],
  mutuallyExclusive: [
    ['git', 'svn']
  ]
});
