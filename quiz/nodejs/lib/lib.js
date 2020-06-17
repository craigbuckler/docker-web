/*
collection of library functions
*/

'use strict';

// clean a string: minimize whitespace, encode HTML entities
module.exports.cleanString = str => str
  .trim()
  .replace(/\s+/g, ' ')
  .replace(/& /g, '&amp; ');
