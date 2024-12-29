/**
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/cli.svg)](https://github.com/faasjs/faasjs/blob/main/packages/cli/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/cli.svg)](https://www.npmjs.com/package/@faasjs/cli)
 *
 * CLI for FaasJS.
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/cli
 * ```
 *
 * ## Usage
 *
 * Add script to package.json:
 *
 * ```json
 * {
 *   "scripts": {
 *     "faas": "faas"
 *   }
 * }
 * ```
 *
 * Get help info: `npm exec faas -h`
 *
 * @packageDocumentation
 */

import { existsSync } from 'node:fs'
import { sep } from 'node:path'
import { Logger } from '@faasjs/logger'
import { Command } from 'commander'
import { version } from '../package.json'
import { NewCommand } from './commands/new'
import { ServerCommand } from './commands/server'

const commander = new Command()
const logger = new Logger('Cli')

commander
  .version(version)
  .usage('[command] [flags]')
  .option('-v --verbose', 'Show verbose logs')
  .option('-r --root <path>', 'Root path')
  .option('-e --env <staging>', 'Environment', 'development')
  .exitOverride(e => console.error(e))

  .on('option:verbose', () => {
    process.env.verbose = '1'
    process.env.FaasLog = 'debug'
    logger.debug('Verbose log enabled.')
  })
  .on('option:root', (root?: string) => {
    if (root && existsSync(root)) {
      process.env.FaasRoot = root
      if (!root.endsWith(sep)) process.env.FaasRoot += sep
    } else throw Error(`Can't find root path: ${root}`)

    logger.debug('root: %s', process.env.FaasRoot)
  })
  .on('option:env', (env?: string) => {
    if (env) process.env.FaasEnv = env

    logger.debug('env: %s', process.env.FaasEnv)
  })

// load commands
NewCommand(commander)
ServerCommand(commander)

export async function main(argv: string[]) {
  try {
    await commander.parseAsync(argv)
  } catch (error: any) {
    logger.error(error)
  }

  return commander
}
