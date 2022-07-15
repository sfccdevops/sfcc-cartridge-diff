'use strict'

const { execSync } = require('child_process')

/**
 * Module Export
 * @param {Object} options CLI Flags
 */
module.exports = (options) => {
  try {
    const results = execSync("git diff --cached  --name-only --ignore-all-space --ignore-blank-lines --ignore-cr-at-eol --unified=0 2> /dev/null | grep -v -e '^[+-]' -e '^index'")
    const changes = results.toString().split('\n')
    const filtered = changes.filter((change) => {
      return change !== null && change !== '' && change.indexOf(options.cartridge) !== -1
    })

    return filtered
  } catch (err) {
    return null
  }
}
