'use strict'

const chalk = require('chalk')
const path = require('path')

const { execSync } = require('child_process')

/**
 * Module Export
 * @param {*} files
 * @param {Object} options CLI Flags
 */
module.exports = (files, options) => {
  files.forEach((file, index) => {
    const sourceFile = path.resolve(file.sourceFile)
    const targetFile = path.resolve(file.targetFile)

    try {
      // Generate File Compare Stats
      let output = execSync(`git diff --shortstat --color=always --ignore-all-space --ignore-blank-lines --ignore-cr-at-eol --exit-code --no-index ${sourceFile} ${targetFile} 2> /dev/null`)
      output = output.toString().trim()

      // Check if there were changes between files
      const hasChanges = output.indexOf(' 0 insertions') === -1 || output.indexOf(' 0 deletions') === -1
      const leftPad = files.length.toString().length * 2 + 6
      const labelCount = `${index + 1}/${files.length}:`.padStart(leftPad, ' ')
      const labelFile = 'FILE:'.padStart(leftPad, ' ')
      const labelChanges = 'CHANGES:'.padStart(leftPad, ' ')

      // Cleanup Output
      output = output.replace('1 file changed, ', '')
      output = output.replace(',', '')

      // Track if File is Junk
      let isJunk = false

      // Clean up File Compare Stats
      if (hasChanges) {
        output = output.replace(/([0-9]+) (insertions?\(\+\))/, `${chalk.bold.green('$1')} ${chalk.green('$2')}`)
        output = output.replace(/([0-9]+) (deletions?\(\-\))/, `${chalk.bold.red('$1')} ${chalk.red('$2')}`)
      } else {
        isJunk = true
        output = `${chalk.bold.yellow('✖ IDENTICAL FILES')}\n`
        output += `${chalk.dim('REMOVE:'.padStart(leftPad, ' '))} ${chalk.dim(file.sourceFile)}`
      }

      if (!options.junkOnly || (options.junkOnly && isJunk)) {
        // Visual Separator to make Report Easier to Read
        if (files.length > 1 && index > 0) {
          console.log(chalk.dim('\n--------------------------------------------------------------------------------\n'))
        }

        // Generate Summary for File Compare
        console.log(`${chalk.dim(labelCount)} ${chalk.bold(file.sourceName)} ${chalk.dim('<=>')} ${chalk.bold(file.targetName)}`)
        console.log(`${chalk.dim(labelFile)} ${chalk.cyan('.' + file.relativePath)}`)
        console.log(`${chalk.dim(labelChanges)} ${output}`)

        // Generate Diff Between Files
        if (options.diff === '' || options.diff.length > 0) {
          // Check if we provided a custom tool we want to diff with, otherwise output to terminal
          if (options.diff.length > 0) {
            console.log(`${chalk.dim('DIFF:'.padStart(leftPad, ' '))} ${chalk.dim(`Opened in ${options.diff}`)}`)
            execSync(`git difftool --tool=${options.diff} --no-prompt  --exit-code --no-index ${sourceFile} ${targetFile}`)
          } else if (hasChanges) {
            console.log(`${chalk.dim('DIFF:'.padStart(leftPad, ' '))} ${chalk.dim('↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓')}\n`)
            execSync(`git diff --color-words --ignore-all-space --ignore-blank-lines --ignore-cr-at-eol --unified=0 --exit-code --no-index ${sourceFile} ${targetFile} 2> /dev/null | tail -n +5`, { stdio: 'inherit' })
          }
        }
      }
    } catch (err) {}
  })
}
