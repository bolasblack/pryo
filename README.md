# pryo [![Build Status](https://img.shields.io/travis/bolasblack/pryo/master.svg?style=flat)](https://travis-ci.org/bolasblack/pryo)

Write [yeoman](http://yeoman.io/) generators in project instead of another package.

## Usage

### Folder structure

```
├───package.json
├───src
└───generators/
    ├───app/
    │   └───index.js
    └───router/
        └───index.js
```

Then use <code>&grave;npm bin&grave;/pryo app</code> to execute generator `generators/app/index.js`

You can custom generators by add `generator-folder` field to `package.json`

### Use other installed generators

Simply use `pryo` instead of `yo`.

For example, I installed [generator-angular](https://github.com/yeoman/generator-angular), then you can execute <code>&grave;npm bin&grave;/pryo angular:controller user</code> to generate controller files.

### Command line options

pryo use [yargs](http://yargs.js.org/) to parse command line optstrings, read the [document](http://yargs.js.org/docs/#parsing-tricks) to learn more

### Example

Read [example](example) for more detail.
