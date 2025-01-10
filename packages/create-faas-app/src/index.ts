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
 *
 * # use bun
 * bunx create-faas-app --name faasjs
 * ```
 *
 * @packageDocumentation
 */

import { Command } from 'commander'
import { version } from '../package.json'
import action from './action'

const commander = new Command()

commander
  .version(version)
  .storeOptionsAsProperties(false)
  .allowUnknownOption(true)
  .name('create-faas-app')
  .exitOverride()

action(commander as Command)

export async function main(argv: string[]) {
  try {
    await commander.parseAsync(argv)
  } catch (error) {
    console.error(error)
  }

  return commander
}
