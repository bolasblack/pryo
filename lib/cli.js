const pryo = require('./index')
const yargs = require('yargs')

// Usage:
//   <cmd> [type] <args...>
//
// Example:
//   <cmd> component pomo_history_list --no-test
module.exports = () => {
  try {
    const parsedArgs = yargs.parse(process.argv.slice(2))
    const matchedGeneratorName = pryo.matchGeneratorName(parsedArgs._[0])
    pryo.run(matchedGeneratorName, parsedArgs._.slice(1), parsedArgs, err => {
      if (err) {
        console.error(err.message)
        process.exit(1)
      }
    })
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}
