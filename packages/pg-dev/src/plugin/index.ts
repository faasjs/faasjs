import { basename, dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Plugin } from 'vitest/config'

const moduleFilename = fileURLToPath(import.meta.url)
const moduleDirname = dirname(moduleFilename)
const moduleExtension = extname(moduleFilename) === '.ts' ? '.ts' : extname(moduleFilename)
const indexPath = join(
  moduleDirname,
  basename(moduleDirname) === 'plugin' ? '..' : '.',
  `index${moduleExtension}`,
)

const DEFAULT_SKIPPED_ENVIRONMENTS = new Set(['happy-dom', 'jsdom'])
const SETUP_MODULE_PREFIX = 'virtual:faasjs-pg-dev/vitest-setup:'

function prependUniqueValue(value: string | string[] | undefined, nextValue: string) {
  const values = typeof value === 'undefined' ? [] : Array.isArray(value) ? value : [value]

  return [nextValue, ...values.filter((item) => item !== nextValue)]
}

function createSetupModuleSource(projectRoot: string) {
  return [
    "import { afterAll, beforeEach } from 'vitest'",
    `import { setupPgVitest } from ${JSON.stringify(indexPath)}`,
    '',
    'setupPgVitest(',
    `  { afterAll, beforeEach, projectRoot: ${JSON.stringify(projectRoot)} },`,
    ')',
    '',
  ].join('\n')
}

function createSetupModuleId(projectRoot: string) {
  return `${SETUP_MODULE_PREFIX}${encodeURIComponent(projectRoot)}`
}

function resolveSetupModuleProjectRoot(id: string) {
  if (!id.startsWith(SETUP_MODULE_PREFIX)) return

  return decodeURIComponent(id.slice(SETUP_MODULE_PREFIX.length))
}

function shouldEnableForProject(project: {
  config: {
    environment?: string
    root?: string
  }
}) {
  const environment = project.config.environment ?? 'node'

  return !DEFAULT_SKIPPED_ENVIRONMENTS.has(environment)
}

/**
 * Creates the Vitest plugin that wires `@faasjs/pg-dev` into the test runner.
 *
 * The plugin prepends a generated setup module for each enabled Vitest project. That setup
 * module registers a lazy database bootstrap instead of starting PGlite during config load:
 * the first default `await getClient()` in a test file starts PGlite, runs migrations from
 * `./src/db/migrations`, backfills `process.env.DATABASE_URL`, and creates the cached
 * `@faasjs/pg` client. Later `beforeEach` hooks close cached clients and clear table contents
 * before each test while preserving the migrations tracking table.
 *
 * By default the plugin skips browser-like projects such as `jsdom` and `happy-dom`. Existing
 * `setupFiles` are preserved and the generated setup module is deduplicated if Vitest config
 * hooks run more than once.
 *
 * @returns {Plugin} Vitest/Vite plugin instance.
 */
export function PgVitestPlugin(): Plugin {
  return {
    name: 'faasjs-pg-vitest-plugin',
    resolveId(id) {
      if (resolveSetupModuleProjectRoot(id)) return `\0${id}`
    },
    load(id) {
      const projectRoot = resolveSetupModuleProjectRoot(id.startsWith('\0') ? id.slice(1) : id)

      if (!projectRoot) return

      return createSetupModuleSource(projectRoot)
    },
    configureVitest({ project }) {
      if (!shouldEnableForProject(project)) return

      const setupModuleId = createSetupModuleId(resolve(project.config.root ?? process.cwd()))

      project.config.setupFiles = prependUniqueValue(project.config.setupFiles, setupModuleId)
    },
  }
}
