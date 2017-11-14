'use strict';
const superb = require('superb');
const normalizeUrl = require('normalize-url');
const Generator = require('yeoman-generator');
const _s = require('underscore.string');
const utils = require('./utils');

module.exports = class extends Generator {
  constructor(a, b) {
    super(a, b);

    this.option('org', {
      type: 'string',
      desc: 'Publish to a GitHub organization account'
    });

    this.option('cli', {
      type: 'boolean',
      desc: 'Add a CLI'
    });

    this.option('coverage', {
      type: 'boolean',
      desc: 'Add code coverage with nyc'
    });

    this.option('codecov', {
      type: 'boolean',
      desc: 'Upload coverage to codecov.io (implies coverage)'
    });

    this.option('webpack', {
      type: 'boolean',
      alias: 'wpk',
      desc: 'Add webpack bundler.'
    });

    this.option('browser', {
      type: 'boolean',
      desc: 'Setup webpack to build for browser library.'
    });

    this.option('wallaby', {
      type: 'boolean',
      alias: 'wlb',
      desc: 'Add wallaby.js config file.'
    });

    this.option('releaseit', {
      type: 'boolean',
      alias: 'rli',
      desc: 'Add release-it configuration.'
    });

    this.option('commitizen', {
      type: 'boolean',
      alias: 'cz',
      desc: 'Add commitizen configuration.'
    });
  }
  init() {
    return this.prompt([
      {
        name: 'moduleName',
        message: 'What do you want to name your module?',
        default: _s.slugify(this.appname),
        filter: x => utils.slugifyPackageName(x)
      },
      {
        name: 'moduleDescription',
        message: 'What is your module description?',
        default: `My ${superb()} module`
      },
      {
        name: 'githubUsername',
        message: 'What is your GitHub username?',
        store: true,
        validate: x => (x.length > 0 ? true : 'You have to provide a username'),
        when: () => !this.options.org
      },
      {
        name: 'website',
        message: 'What is the URL of your website?',
        store: true,
        validate: x =>
          x.length > 0 ? true : 'You have to provide a website URL',
        filter: x => normalizeUrl(x)
      },
      {
        name: 'cli',
        message: 'Do you need a CLI?',
        type: 'confirm',
        default: Boolean(this.options.cli),
        when: () => this.options.cli === undefined
      },
      {
        name: 'nyc',
        message: 'Do you need code coverage?',
        type: 'confirm',
        default: Boolean(this.options.codecov || this.options.coverage),
        when: () =>
          this.options.coverage === undefined &&
          this.options.codecov === undefined
      },
      {
        name: 'codecov',
        message: 'Upload coverage to codecov.io?',
        type: 'confirm',
        default: false,
        when: x =>
          (x.nyc || this.options.coverage) && this.options.codecov === undefined
      },
      {
        name: 'webpack',
        message: 'Setup webpack build chain?',
        type: 'confirm',
        default: false,
        when: () => this.options.webpack === undefined
      },
      {
        name: 'browser',
        message: 'Setup webpack to build for browser?',
        type: 'confirm',
        default: false,
        when: x => (x.webpack || this.options.webpack) && this.options.browser === undefined
      },
      {
        name: 'wallaby',
        message: 'Setup wallaby config?',
        type: 'confirm',
        default: true,
        when: () => this.options.wallaby === undefined
      },
      {
        name: 'releaseit',
        message: 'Setup release-it config?',
        type: 'confirm',
        default: false,
        when: () => this.options.releaseit === undefined
      },
      {
        name: 'commitizen',
        message: 'Setup commitizen locally?',
        type: 'confirm',
        default: true,
        when: () => this.options.commitizen === undefined
      }
    ]).then(props => {
      const or = (option, prop) =>
        this.options[option] === undefined ? props[prop || option] : this.options[option];

      const cli = or('cli');
      const codecov = or('codecov');
      const nyc = codecov || or('coverage', 'nyc');
      const webpack = or('webpack');
      const browser = or('browser');
      const wallaby = or('wallaby');
      const releaseit = or('releaseit');
      const commitizen = or('commitizen');

      const repoName = utils.repoName(props.moduleName);

      const tpl = {
        moduleName: props.moduleName,
        moduleDescription: props.moduleDescription,
        camelModuleName: _s.camelize(repoName),
        githubUsername: this.options.org || props.githubUsername,
        repoName,
        name: this.user.git.name(),
        email: this.user.git.email(),
        website: props.website,
        humanizedWebsite: props.website,
        cli,
        nyc,
        codecov,
        webpack,
        browser,
        wallaby,
        releaseit,
        commitizen
      };

      const mv = (from, to) => {
        this.fs.move(this.destinationPath(from), this.destinationPath(to));
      };

      this.fs.copyTpl(
        [`${this.templatePath()}/**`, '!**/cli.js', '!**/webpack.config.js', '!**/wallaby.js'],
        this.destinationPath(),
        tpl
      );

      if (cli) {
        this.fs.copyTpl(
          this.templatePath('cli.js'),
          this.destinationPath('src/cli.js'),
          tpl
        );
      }

      if (webpack) {
        this.fs.copyTpl(
          this.templatePath('webpack.config.js'),
          this.destinationPath('webpack.config.js'),
          tpl
        );
      }

      if (wallaby) {
        this.fs.copyTpl(
          this.templatePath('wallaby.js'),
          this.destinationPath('wallaby.js'),
          tpl
        );
      }

      mv('eslintrc', '.eslintrc');
      mv('editorconfig', '.editorconfig');
      mv('gitattributes', '.gitattributes');
      mv('gitignore', '.gitignore');
      mv('travis.yml', '.travis.yml');
      mv('npmrc', '.npmrc');
      mv('babelrc', '.babelrc');
      mv('_package.json', 'package.json');
      mv('index.js', 'src/index.js');
      mv('test.js', 'test/test.js');
    });
  }
  git() {
    this.spawnCommandSync('git', ['init']);
  }
  install() {
    const devDeps = ['chai', 'mocha', 'nodemon', 'nyc', 'eslint-plugin-prettier', 'eslint-config-prettier', 'husky', 'lint-staged'];
    if (this.options.webpack) {
      devDeps.push(...['webpack', 'babel-cli', 'babel-core', 'babel-eslint', 'babel-loader', 'babel-plugin-add-module-exports', 'babel-plugin-istanbul', 'babel-preset-es2015', 'babel-preset-latest']);
    }
    if (this.options.codecov || this.options.coverage) {
      devDeps.push(...['coveralls', 'nyc']);
    }
    if (this.options.commitizen) {
      devDeps.push(...['cz-conventional-changelog', 'commitizen']);
    }
    this.npmInstall(devDeps, {'save-dev': true});
  }
};
