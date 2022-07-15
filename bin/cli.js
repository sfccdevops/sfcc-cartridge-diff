#!/usr/bin/env node

'use strict'

const chalk = require('chalk')
const path = require('path')
const yargs = require('yargs')

// Generate CLI Options
const cli = yargs
  .scriptName('sfcc-diff')
  .usage(`\n${chalk.cyan.bold('Usage:')} ${chalk.bold.green('sfcc-diff')} ${chalk.bold('--cartridge')} app_client_name ${chalk.dim('--options')}`)
  .options({
    cartridge: {
      alias: 'c',
      describe: 'Source Cartridge',
      type: 'string',
      demandOption: true,
    },
    diff: {
      alias: 'd',
      describe: 'Show Full Diff',
      type: 'string',
    },
    exclude: {
      alias: 'e',
      describe: 'List of Cartridges to Exclude',
      type: 'array',
    },
    filter: {
      alias: 'f',
      describe: 'Filter Results for Match',
      type: 'string',
    },
    include: {
      alias: 'i',
      describe: 'List of Cartridges to Include',
      type: 'array',
    },
    'junk-only': {
      alias: 'j',
      describe: 'Junk Files Only',
      type: 'boolean',
    },
    'modified-only': {
      alias: 'm',
      describe: 'Modified Files Only',
      type: 'boolean',
    },
  })
  .example('sfcc-diff --cartridge app_client_name', 'Run Test on URL')
  .example('sfcc-diff -c app_client_name --diff', 'Generate Diff in Terminal')
  .example('sfcc-diff -c app_client_name --diff=ksdiff', 'Generate Diff in ksdiff App')
  .example('sfcc-diff -c app_client_name --modified-only', 'Use Git Commit for Compare')
  .example('sfcc-diff -c app_client_name --junk-only', 'Just list Junk Files')
  .example('sfcc-diff -c app_client_name -m -d ksdiff', 'Modified Only and Diff')
  .example('sfcc-diff -c app_client_name -f .isml', 'Filter for ISML files')
  .example('sfcc-diff -c app_client_name -f common.properties', 'Filter for Specific File')
  .example('sfcc-diff -c app_client_name -i third_party_core', 'Compare Two Cartridges')
  .updateStrings({
    'Options:': chalk.cyan('Options:\n'),
    'Examples:': chalk.cyan('Examples:\n'),
  })
  .fail((msg, err, yargs) => {
    yargs.showHelp()
    console.log(`\n${chalk.bold.red('✖ ERROR:')} ${msg}\n`)
    process.exitCode = 1
  })
  .wrap(100)
  .help('help')
  .alias('help', 'h')
  .epilogue(`${chalk.bold.cyan('Need Help?')} https://github.com/sfccdevops/sfcc-cartridge-diff`)
  .strict()
  .version().argv

// Load CLI Command
require(path.join(__dirname, '../commands/sfcc-diff.js'))(cli)

module.exports = cli
