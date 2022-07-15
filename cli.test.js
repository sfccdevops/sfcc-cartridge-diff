// Strip ANSI Colors
const stripColor = (output) => {
  return output.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
}

// Mock Functions
jest.spyOn(process, 'exit').mockImplementation(() => {})
jest.spyOn(console, 'error').mockImplementation(() => {})
jest.spyOn(console, 'log').mockImplementation(() => {})

it('returns help output', async () => {
  const yargs = require('yargs')(['--help'])

  // Initialize parser using the command module
  const parser = yargs.command(require('./bin/cli.js'))

  // Run the command module with --help as argument
  const output = await new Promise((resolve) => {
    parser.parse('--help', (err, argv, output) => {
      resolve(stripColor(output))
    })
  })

  // Verify the output is correct
  expect(output).toEqual(expect.stringContaining('Usage: sfcc-diff --cartridge app_client_name --options'))
})
