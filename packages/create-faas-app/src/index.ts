/**
 * # create-faas-app
 *
 * [![License: MIT](https://img.shields.io/npm/l/create-faas-app.svg)](https://github.com/faasjs/faasjs/blob/main/packages/create-faas-app/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/create-faas-app.svg)](https://www.npmjs.com/package/create-faas-app)
 *
 * Curated scaffolder for FaasJS projects. The `admin` template is the default
 * React + Ant Design + PostgreSQL starter, and `minimal` provides a smaller
 * React starter. After scaffolding, the CLI runs `npm install`, `npm run types`,
 * and `npm run test` in the new project.
 *
 * ## Usage
 *
 * ```bash
 * npx create-faas-app --name faasjs
 * npx create-faas-app --name faasjs-admin --template admin
 * npx create-faas-app --name faasjs-minimal --template minimal
 * ```
 *
 * @packageDocumentation
 */

import { Command } from 'commander'

import PackageJSON from '../package.json' with { type: 'json' }
import action from './action'

const commander = new Command()

commander
  .storeOptionsAsProperties(false)
  .configureOutput({ writeErr: () => undefined })
  .version(PackageJSON.version)
  .name('create-faas-app')
  .exitOverride()

action(commander as Command)

/**
 * Run the `create-faas-app` CLI with a provided argv array.
 *
 * The array should use the same shape as `process.argv`, including executable
 * and script slots. Parsing may prompt for a project name, create files, install
 * dependencies, generate FaasJS action types, and run template tests. Commander
 * help exits are swallowed and return the shared program. Parsing and action
 * failures are rethrown so library callers and the executable entry point can
 * handle them without duplicate error output.
 *
 * @param {string[]} argv - CLI arguments forwarded to Commander.
 * @returns {Promise<Command>} Commander program instance after parsing.
 * @throws The original Commander or action error when parsing or scaffolding fails.
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

    throw error
  }

  return commander
}
