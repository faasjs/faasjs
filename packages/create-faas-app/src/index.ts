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
import action from './action'

const commander = new Command()

commander
  .storeOptionsAsProperties(false)
  .allowUnknownOption(true)
  .name('create-faas-app')

action(commander as Command)

async function main() {
  try {
    if (!process.env.CI && process.argv[0] !== 'fake')
      await commander.parseAsync(process.argv)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export default main()
