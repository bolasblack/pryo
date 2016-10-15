'use strict'

process.env.NODE_ENV = 'test'

const mockFS = require('mock-fs')
const generators = require('yeoman-generator')
const findUp = require('find-up')
const fs = require('fs')
const pryo = require('../')

describe('index', () => {
  afterEach(() => {
    pryo.getGeneratorInfos.clean()
    mockFS.restore()
  })

  describe('.getGeneratorRootDir', () => {
    it('works', () => {
      mockFS({
        '/test/path/to/package.json': '{}',
        '/test/path/to/generators': {},
      })
      process.chdir('/test/path/to/')
      expect(pryo.getGeneratorRootDir()).toBe('/test/path/to/generators')
    })

    it('support `generator-folder` field in package.json', () => {
      mockFS({
        '/test/path/to/package.json': JSON.stringify({'generator-folder': 'hello'}),
        '/test/path/to/hello': {},
      })
      process.chdir('/test/path/to/')
      expect(pryo.getGeneratorRootDir()).toBe('/test/path/to/hello')
    })

    it('throw error if package.json not exist', () => {
      mockFS({'/test/path/to/': mockFS.directory()})
      process.chdir('/test/path/to/')
      expect(() => pryo.getGeneratorRootDir()).toThrowError(pryo.ProjectRootNotFoundError)
    })

    it('throw error if package.json is invalid', () => {
      mockFS({'/test/path/to/package.json': '{aaa}'})
      process.chdir('/test/path/to/')
      expect(() => pryo.getGeneratorRootDir()).toThrowError(pryo.PackageFileParseFailedError)
    })

    it('throw error if generator folder not exist', () => {
      mockFS({'/test/path/to/package.json': '{}'})
      process.chdir('/test/path/to/')
      expect(() => pryo.getGeneratorRootDir()).toThrowError(pryo.GeneratorFolderNotExistError)
    })
  })

  describe('.getGeneratorInfos', () => {
    it('works', () => {
      mockFS({
        '/test/path/to': {
          'package.json': '{}',
          'generators': {
            'controller': {'index.js': '{}'},
            'model': {'index': '{}'},
          },
        },
      })
      process.chdir('/test/path/to/')
      expect(pryo.getGeneratorInfos()).toEqual([
        {name: 'controller', fullPath: '/test/path/to/generators/controller'},
        {name: 'model', fullPath: '/test/path/to/generators/model'},
      ])

      mockFS.restore()
      mockFS({
        '/test/path/to': {
          'package.json': '{}',
          'generators': {
            'controller': {'index.js': '{}'},
          },
        },
      })
      expect(fs.readdirSync('/test/path/to/generators')).toEqual(['controller'])
      expect(pryo.getGeneratorInfos()).toEqual([
        {name: 'controller', fullPath: '/test/path/to/generators/controller'},
        {name: 'model', fullPath: '/test/path/to/generators/model'},
      ])
    })
  })

  describe('.matchGeneratorName', () => {
    it('works', () => {
      mockFS({
        '/test/path/to': {
          'package.json': '{}',
          'generators': {
            'component': {'index.js': '{}'},
            'coa': {'index.js': '{}'},
            'mo': {'index.js': '{}'},
            'model': {'index.js': '{}'},
          },
        },
      })
      process.chdir('/test/path/to/')

      expect(pryo.matchGeneratorName('mo')).toBe('mo')
      expect(pryo.matchGeneratorName('co')).toBe('coa')
      expect(pryo.matchGeneratorName('coa')).toBe('coa')
      expect(pryo.matchGeneratorName('component')).toBe('component')
    })
  })

  describe('.createEnv', () => {
    it('works', () => {
      mockFS({
        '/test/path/to': {
          'package.json': '{"name": "hello"}',
          'generators': {},
        },
      })

      const generatorTestResults = {}
      const Generator = generators.Base.extend({
        test: function() {
          generatorTestResults['templatePath'] = this.templatePath()
          generatorTestResults['destinationPath'] = this.destinationPath()
        },
      })

      return new Promise((resolve, reject) => {
        process.chdir('/test/path/to/')
        const env = pryo.createEnv([{name: 'hello', Generator, fullPath: '/test/path/to/generators/hello'}])
        env.run('_currentApp:hello', {}, () => {
          expect(generatorTestResults.templatePath).toBe('/test/path/to/generators/hello/templates')
          expect(generatorTestResults.destinationPath).toBe('/test/path/to')
          resolve()
        })
      })
    })
  })
})
