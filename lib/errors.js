const util = require('util')

function GeneratorFolderNotExistError(message) {
  Error.call(this)
  this.message = message
}
util.inherits(GeneratorFolderNotExistError, Error)

function ProjectRootNotFoundError(message) {
  Error.call(this)
  this.message =
    message ||
    'Can not found project root path, do you already created package.json?'
}
util.inherits(ProjectRootNotFoundError, Error)

function PackageFileParseFailedError(error) {
  Error.call(this)
  this.message = `package.json parse failed: \n\n${error.stack}`
}
util.inherits(PackageFileParseFailedError, Error)

module.exports = {
  GeneratorFolderNotExistError,
  ProjectRootNotFoundError,
  PackageFileParseFailedError,
}
