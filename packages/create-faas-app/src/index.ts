/**
 * [![License: MIT](https://img.shields.io/npm/l/create-faas-app.svg)](https://github.com/faasjs/faasjs/blob/main/packages/create-faas-app/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/create-faas-app.svg)](https://www.npmjs.com/package/create-faas-app)
 *
 * Quick way to create a FaasJS project.
 *
 * ## Usage
 *
 * ```bash
 * # use npm
 * npx create-faas-app --name faasjs
 * npx create-faas-app --name faasjs-admin --template antd
 *
 * # use bun
 * bunx create-faas-app --name faasjs
 * bunx create-faas-app --name faasjs-admin --template antd
 * ```
 */

import { Command } from 'commander'

import PackageJSON from '../package.json' with { type: 'json' }
import action from './action'

const commander = new Command()

commander
  .storeOptionsAsProperties(false)
  .allowUnknownOption(true)
  .version(PackageJSON.version)
  .name('create-faas-app')
  .exitOverride()

action(commander as Command)

/**
 * Run the `create-faas-app` CLI with a provided argv array.
 *
 * @param {string[]} argv - CLI arguments forwarded to Commander.
 * @returns {Promise<Command>} Commander program instance after parsing.
 *
 * @example
 * ```ts
 * import { main } from 'create-faas-app'
 *
 * await main(['node', 'create-faas-app', '--help'])
 * ```
 */
export async function main(argv: string[]) {
  try {
    await commander.parseAsync(argv)
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'commander.helpDisplayed'
    )
      return commander

    console.error(error)
  }

  return commander
}
