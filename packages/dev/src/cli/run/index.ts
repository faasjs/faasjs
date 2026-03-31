import { spawn } from 'node:child_process'
import { existsSync, realpathSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { loadEnvFileIfExists } from '@faasjs/node-utils'

import { createMain, parseCommonCliArgs, printVersion } from '../shared'

const HelpText = `Run a TypeScript file with FaasJS Node module hooks.

Usage:
  faas run [options] <file> [...args]

Options:
  --root <path>      Project root path used to resolve <file> (default: process.cwd())
  -h, --help         Show help
  -v, --version      Show version
`

function resolveRegisterHooksSpecifier(): string {
  const candidates = [join(process.cwd(), 'packages', 'node-utils', 'dist', 'register_hooks.mjs')]

  if (process.argv[1]) {
    try {
      candidates.unshift(
        join(dirname(realpathSync(process.argv[1])), '../node-utils/dist/register_hooks.mjs'),
      )
    } catch {}
  }

  const resolved = candidates.find((candidate) => existsSync(candidate))

  if (!resolved) throw Error('[faas run] Cannot resolve @faasjs/node-utils/register-hooks')

  return pathToFileURL(resolved).href
}

async function runFile(file: string, args: string[], cwd: string): Promise<number> {
  const registerHooksSpecifier = resolveRegisterHooksSpecifier()

  return await new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, ['--import', registerHooksSpecifier, file, ...args], {
      cwd,
      env: process.env,
      stdio: 'inherit',
    })

    child.once('error', reject)
    child.once('close', (code, signal) => resolvePromise(code ?? (signal ? 1 : 0)))
  })
}

/**
 * Run a local script through Node with FaasJS loader hooks preloaded.
 *
 * The command loads `.env` from `--root` or `process.cwd()`, resolves the
 * target file, preloads `@faasjs/node-utils/register-hooks`, and then
 * delegates execution to a child Node process so the target script receives
 * a normal `process.argv`.
 *
 * @param {string[]} args - Arguments after `faas run`.
 * @returns Exit code returned by the child process.
 * @throws {Error} When the file argument is missing.
 */
export async function run(args: string[]): Promise<number> {
  const { mode, options, rest } = parseCommonCliArgs(args, 'faas run', {
    stopAtFirstPositional: true,
  })

  if (mode === 'help') {
    console.log(HelpText)
    return 0
  }

  if (mode === 'version') return printVersion()

  if (!rest[0]) throw Error('[faas run] Missing file name')

  const cwd = resolve(options.root ?? process.cwd())
  const file = resolve(cwd, rest[0])

  loadEnvFileIfExists({
    cwd,
  })

  return await runFile(file, rest.slice(1), cwd)
}

/**
 * Default Node.js entrypoint for `faas run`.
 */
export const main = createMain(run)
