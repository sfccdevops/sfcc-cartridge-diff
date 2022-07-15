'use strict'

const chalk = require('chalk')
const ora = require('ora')
const prompts = require('prompts')

// Required Libraries
const cartridgeCompare = require('../lib/cartridgeCompare')
const diff = require('../lib/diff')
const fileCompare = require('../lib/fileCompare')
const getCartridges = require('../lib/getCartridges')
const gitChanges = require('../lib/gitChanges')

/**
 * Module Export
 * @param {Object} options CLI Flags
 */
module.exports = async (options) => {
  // Exit if Cartridge is Missing
  if (!options.cartridge) {
    return process.exit()
  }

  // Empty Line
  console.log('')

  const spinner = ora(`${chalk.bold('SFCC DIFF:')} ${chalk.cyan.bold(options.cartridge)} comparing cartridges ... ${chalk.dim('[Ctrl-C to Cancel]')}\n`)
  spinner.start()

  // Get Cartridges
  const cartridges = getCartridges(options)

  // Exit if No Cartridges
  if (!cartridges) {
    spinner.fail('Unable to Find SFCC Cartridges')
    return process.exit()
  }

  // Compare Cartridges
  const compare = cartridgeCompare(cartridges, options)

  // Exit if No Compare
  if (!compare) {
    spinner.fail(`No cartridge named ${chalk.cyan(options.cartridge)} detected\n`)
    return process.exit()
  }

  // Check for Changes
  const changes = options.modifiedOnly ? gitChanges(options) : null

  // Exit if No Changes
  if (!changes && options.modifiedOnly) {
    spinner.succeed(`No overrides detected between ${chalk.cyan(options.cartridge)} and ${options.include ? chalk.cyan(options.include.splice(0, options.include.length - 1).join(', ')) : 'other cartridges'}\n`)
    return process.exit()
  }

  // Get Files from Compare
  const files = fileCompare(compare, changes, options)

  // Exit if No Files
  if (!files || files.length === 0) {
    spinner.succeed(`No overrides detected between ${chalk.cyan(options.cartridge)} and ${options.include ? chalk.cyan(options.include.splice(0, options.include.length - 1).join(', ')) : 'other cartridges'}\n`)
    return process.exit()
  }

  // Cartridge Checking Complete
  spinner.stop()

  // Confirm if requested to open files in diff tool if it might spawn a bunch of windows
  if (options.diff && (options.diff === '' || options.diff.length > 0) && files.length >= 5) {
    // Prompt User
    const confirmDiff = await prompts({
      type: 'confirm',
      name: 'agree',
      message: `Generate Diffs for ${files.length} files?`,
    })

    // Check if user changed their mind about generating that many diffs
    if (!confirmDiff || !confirmDiff.agree) {
      // Remove Options to Generate Detailed Diffs
      delete options.diff
    }

    // Empty Line
    console.log('')
  }

  // Generate Diff Summary ( and full diff if requested )
  diff(files, options)

  // Empty Line
  console.log('')

  // Exit Cleanly
  return process.exit()
}
