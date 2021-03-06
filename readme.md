# generator-nm [![Build Status](https://travis-ci.org/sindresorhus/generator-nm.svg?branch=master)](https://travis-ci.org/sindresorhus/generator-nm)

> Scaffold out a [node module](https://github.com/sindresorhus/node-module-boilerplate)

Optionally with a [CLI](http://en.wikipedia.org/wiki/Command-line_interface).

## Install

```
$ npm install --global yo generator-nmlib
```


## Usage

With [yo](https://github.com/yeoman/yo):

```
$ yo nmlib
```

There are multiple command-line options available:

```
$ yo nmlib --help

  Usage:
    yo nmlib [options]

  Options:
    --help          # Print the generator's options and usage
    --skip-cache    # Do not remember prompt answers                      Default: false
    --skip-install  # Do not automatically install dependencies           Default: false
    --org           # Publish to a GitHub organization account
    --cli           # Add a CLI
    --coverage      # Add code coverage with nyc
    --codecov       # Upload coverage to codecov.io (implies --coverage)
    --webpack       # Setup webpack config
    --wallaby       # Setup webpack config
    --releaseit     # Setup webpack config
    --commitizen    # Setup webpack config
```

The `--org` option takes a string value (i.e. `--org=avajs`). All others are boolean flags and can be negated with the `no` prefix (i.e. `--no-codecov`). You will be prompted for any options not passed on the command-line.


## License

Based on MIT © [Sindre Sorhus](https://sindresorhus.com)
MIT © [Nam Pham](https://github.com/nampdn)
