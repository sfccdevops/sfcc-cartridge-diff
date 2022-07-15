'use strict'

/**
 * Module Export
 * @param {Object} cartridges SFCC Cartridges
 * @param {Object} changes Detected Git Changes
 * @param {Object} options CLI Flags
 * @returns {Object} Filtered Array of Cartridges
 */
module.exports = (cartridges, changes, options) => {
  // If we do not want to filter by modified files only, return original set of files
  if (!options.modifiedOnly) {
    return cartridges
  }

  // Create placeholder for Modified Cartridges
  let files = []

  // Loop through Git Changes for Matching Cartridge Files
  changes.forEach((change) => {
    cartridges.forEach((cartridge) => {
      // If cartridge file matches one of the git commits, add it to our list
      if (change.indexOf(cartridge.relativePath) !== -1 && (!options.junkOnly || (options.junkOnly && cartridge.fileIsJunk))) {
        files.push(cartridge)
      }
    })
  })

  return files
}
