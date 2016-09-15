'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const optionator = require('optionator');
const version = require('../package.json').version;
const url = require('../package.json').repository.url;

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
  }
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
