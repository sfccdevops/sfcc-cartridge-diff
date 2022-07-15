'use strict'

const fs = require('fs')
const path = require('path')

/**
 * Exclude Folder Check
 * @param {String} dir Name of Folder
 */
const excluded = (dir) => {
  const isHidden = dir.startsWith('.')
  const ignored = ['node_modules', 'data', 'images', 'sfcc-ci', 'sfra-webpack-builder', 'modules']

  return !isHidden && ignored.indexOf(dir) === -1
}

/**
 * Get Cartridges
 * @param {String} source Path to Source Cartridge Folder
 */
const getCartridges = (source) =>
  fs
    .readdirSync(source, {
      withFileTypes: true,
    })
    .filter((dir) => dir.isDirectory())
    .filter((dir) => excluded(dir.name))
    .map((dir) => dir.name)

// Get Cartridge Folder Names
const folders = getCartridges(path.resolve(process.cwd()))

// Track List of Cartridges
let list = []

// Loop through folder list
folders.forEach((folder) => {
  const cartridge = path.resolve(path.join(process.cwd()), folder, 'cartridge')
  const cartridges = path.resolve(path.join(process.cwd()), folder, 'cartridges')

  // See if we have a matching cartridge in this new folder
  if (fs.existsSync(cartridge)) {
    list.push({
      name: folder,
      path: cartridge.replace('/cartridge', '').replace(process.cwd(), '.'),
      parent: null,
    })
  }

  // Check Folder for Sub Cartridges
  if (fs.existsSync(cartridges)) {
    const subCartridges = getCartridges(cartridges)

    subCartridges.forEach((sub) => {
      const subPath = path.resolve(path.join(process.cwd()), folder, 'cartridges', sub)
      if (fs.existsSync(cartridges)) {
        list.push({
          name: sub,
          path: subPath.replace(process.cwd(), '.'),
          parent: folder,
        })
      }
    })
  }
})

/**
 * Module Export
 * @param {Object} options CLI Flags
 */
module.exports = (options) => {
  // Check if we are excluding any cartridges
  if (options.exclude && options.exclude.length > 0) {
    list = list.filter((cartridge) => {
      return options.exclude.indexOf(cartridge.name) === -1
    })
  }

  // Check if we are are only wanting to include specific cartridges
  if (options.include && options.include.length > 0) {
    // Add source cartridge back in if it's not there
    if (options.include.indexOf(options.cartridge) === -1) {
      options.include.push(options.cartridge)
    }

    list = list.filter((cartridge) => {
      return options.include.indexOf(cartridge.name) > -1
    })
  }

  return list.sort()
}
