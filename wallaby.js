module.exports = function (wallaby) {
  return {
    files: ['app/**/*.js', '!app/templates/*'],

    tests: ['test.js'],

    env: {
      type: 'node',
      runner: 'node'
    },
    compilers: {
      '**/*.js': wallaby.compilers.babel()
    },
    testFramework: 'ava'
  };
};
