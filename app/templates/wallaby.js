module.exports = function(wallaby) {
  return {
    maxConsoleMessagesPerTest: 100000,
    files: ['src/**/*.js'],

    tests: ['test/**/*.js'],

    setup: function() {
      var chai = require('chai');

      global.expect = chai.expect;
    },

    env: {
      type: 'node',
      runner: 'node'
    },

    compilers: {
      '**/*.js': wallaby.compilers.babel()
    }
  };
};
