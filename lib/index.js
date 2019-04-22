'use strict'

const fs = require('fs')
const path = require('path')
const yeomanEnv = require('yeoman-environment')
const findUp = require('find-up')
const _find = require('lodash/find')
const _extend = require('lodash/extend')
const _startsWith = require('lodash/startsWith')
const _sortBy = require('lodash/sortBy')
const errors = require('./errors')

const isFolderExist = path => {
  try {
    return fs.statSync(path).isDirectory()
  } catch (err) {
    return false
  }
}

const getGeneratorRootDir = () => {
  const pkgFilePath = findUp.sync('package.json', { cwd: process.cwd() })
  if (!pkgFilePath) {
    throw new errors.ProjectRootNotFoundError()
  }

  let pkgFileContent
  try {
    pkgFileContent = JSON.parse(fs.readFileSync(pkgFilePath))
  } catch (err) {
    throw new errors.PackageFileParseFailedError(err)
  }

  const generatorRootDir = path.resolve(
    pkgFilePath,
    '../',
    pkgFileContent['generator-folder'] || 'generators',
  )

  if (!isFolderExist(generatorRootDir)) {
    throw new errors.GeneratorFolderNotExistError(
      `Generator folder ${generatorRootDir} not exists`,
    )
  }

  return generatorRootDir
}

const getGeneratorInfos = (() => {
  let cache

  const getGeneratorInfos = generatorRootDir => {
    if (cache) {
      return cache
    }

    generatorRootDir = generatorRootDir || getGeneratorRootDir()

    cache = fs
      .readdirSync(generatorRootDir)
      .map(file => {
        return {
          name: file,
          fullPath: path.join(generatorRootDir, file),
        }
      })
      .filter(info => {
        return isFolderExist(info.fullPath)
      })

    return cache
  }

  getGeneratorInfos.clean = () => {
    cache = null
  }

  return getGeneratorInfos
})()

const createEnv = generatorInfos => {
  const env = yeomanEnv.createEnv()

  // Make Generator#sourceRoot() return the folder `/project-path/generators/generatorName`
  // instead of `/project-path`
  // See also:
  //   https://github.com/yeoman/environment/blob/019af2d6c335584f06378a295016c96bf7eee0c3/lib/environment.js#L325
  //   https://github.com/yeoman/generator/blob/b605a5c79e1afebfc4df1c1bec76f4ac6d3e545d/lib/base.js#L161
  env.instantiate = function(Generator, options) {
    const generatorInfo = _find(generatorInfos, {
      name: Generator.namespace.replace(/^_currentApp:/, ''),
    })
    if (generatorInfo) {
      Generator.resolved = path.join(generatorInfo.fullPath, './index.js')
    }
    return yeomanEnv.prototype.instantiate.call(this, Generator, options)
  }

  generatorInfos.forEach(info => {
    let Generator
    if (info.Generator) {
      Generator = info.Generator
    } else {
      Generator = require(info.fullPath)
    }
    env.registerStub(Generator, `_currentApp:${info.name}`)
  })

  return env
}

const matchGeneratorName = term => {
  const generatorInfos = _sortBy(getGeneratorInfos(), 'name')
  const fullyMatched = generatorInfos.filter(info => info.name === term)
  const fuzzyMatched = generatorInfos.filter(info =>
    _startsWith(info.name, term),
  )
  let generatorName
  if (fullyMatched.length) {
    generatorName = fullyMatched[0].name
  } else if (fuzzyMatched.length) {
    generatorName = fuzzyMatched[0].name
  } else {
    generatorName = term
  }
  return generatorName
}

module.exports = {
  getGeneratorRootDir,
  getGeneratorInfos,
  matchGeneratorName,
  run: (generatorName, argv, options, done) => {
    const env = createEnv(getGeneratorInfos())
    const currentAppGeneratorName = `_currentApp:${generatorName}`
    if (env.getGeneratorsMeta()[currentAppGeneratorName]) {
      env.run([currentAppGeneratorName].concat(argv), options, done)
    } else {
      env.lookup(() => {
        env.run([generatorName].concat(argv), options, done)
      })
    }
  },
}

_extend(module.exports, errors)

if (process.env.NODE_ENV === 'test') {
  module.exports.createEnv = createEnv
}
