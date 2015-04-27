module.exports = function (path) {
  'use strict';
  return require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../../../src/') + path);
};
