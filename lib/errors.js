const util = require('util')

function GeneratorFolderNotExistError(message) {
  Error.call(this)
  this.message = message
}
util.inherits(GeneratorFolderNotExistError, Error)

function ProjectRootNotFoundError(message) {
  Error.call(this)
  this.message = (message || 'Project root path found, do you already created package.json?')
}
util.inherits(ProjectRootNotFoundError, Error)

module.exports = {
  GeneratorFolderNotExistError,
  ProjectRootNotFoundError,
}
