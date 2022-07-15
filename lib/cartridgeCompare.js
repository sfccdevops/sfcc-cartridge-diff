'use strict'

const path = require('path')

const { compareSync } = require('dir-compare')
const { execSync } = require('child_process')

/**
 * Module Export
 * @param {Object} cartridges
 * @param {Object} options CLI Flags
 */
module.exports = (cartridges, options) => {
  let diffs = []

  // Get the --cartridge defined and set it as the Source
  const source = cartridges.filter((cartridge) => {
    return cartridge.name === options.cartridge
  })

  // Check that we got a source cartridge
  if (!source || source.length === 0) {
    return null
  }

  // Loop through cartridges and store details
  cartridges.forEach((cartridge) => {
    // We can skip our Source Cartridge
    if (cartridge.path !== source[0].path) {
      // Compare Files Between Cartridges
      const diff = compareSync(cartridge.path, source[0].path, {
        compareContent: true,
        ignoreLineEnding: true,
        ignoreWhiteSpaces: true,
      })

      // Fetch File Details from Compare
      diff.diffSet.forEach((dif) => {
        // Check that this is a file, and that it is not a hidden or static file
        if (dif.reason && dif.type1 === 'file' && dif.type2 === 'file' && dif.relativePath.indexOf('/cartridge/static/') === -1 && !dif.name1.startsWith('.')) {
          const sourceFile = `${source[0].path}${dif.relativePath}/${dif.name1 || dif.name2}`
          const targetFile = `${cartridge.path}${dif.relativePath}/${dif.name1 || dif.name2}`

          // Compare file sizes, if they are close, do a quick diff compare to see if they are actually the same with whitespace issues
          const ratio = dif.size1 / dif.size2
          const checkNeeded = ratio >= 0.99 && ratio <= 1.01

          let fileIsJunk = checkNeeded

          if (checkNeeded) {
            try {
              let checkJunk = execSync(`diff ${path.resolve(sourceFile)} ${path.resolve(targetFile)} --ignore-all-space --brief | grep -q 'differ' && echo 'differ'`)
              checkJunk = checkJunk.toString().trim()
              fileIsJunk = checkJunk !== null ? checkJunk.length === 0 : true
            } catch (err) {}
          }

          // Only track file if requested
          if (!options.junkOnly || (options.junkOnly && fileIsJunk)) {
            const relPath = `${dif.relativePath}/${dif.name1 || dif.name2}`

            // Check for File Filter
            if (!options.filter || relPath.indexOf(options.filter) > -1) {
              diffs.push({
                fileIsJunk: fileIsJunk,
                relativePath: relPath,
                sourceFile: sourceFile,
                sourceName: source[0].name,
                targetFile: targetFile,
                targetName: cartridge.name,
              })
            }
          }
        }
      })
    }
  })

  return diffs
}
