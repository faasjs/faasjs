import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Plugin } from 'vitest/config'

const moduleFilename = typeof __filename === 'string' ? __filename : fileURLToPath(import.meta.url)
const moduleDirname = dirname(moduleFilename)
const moduleExtension = extname(moduleFilename) === '.ts' ? '.ts' : extname(moduleFilename)
const indexPath = join(moduleDirname, `index${moduleExtension}`)

const DEFAULT_SKIPPED_ENVIRONMENTS = new Set(['happy-dom', 'jsdom'])
const SETUP_MODULE_PREFIX = 'virtual:typed-pg-dev/vitest-setup:'

function prependUniqueValue(value: string | string[] | undefined, nextValue: string) {
  const values = typeof value === 'undefined' ? [] : Array.isArray(value) ? value : [value]

  return [nextValue, ...values.filter((item) => item !== nextValue)]
}

function createSetupModuleSource(projectRoot: string) {
  return [
    "import { afterAll, beforeEach } from 'vitest'",
    `import { setupTypedPgVitest } from ${JSON.stringify(indexPath)}`,
    '',
    'setupTypedPgVitest(',
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
 * The plugin registers a lazy setup module for each enabled project. The first `await getClient()`
 * in a test file starts PGlite, runs migrations from `./migrations`, backfills
 * `process.env.DATABASE_URL`, and later `beforeEach` hooks clear table contents before each test.
 *
 * By default the plugin skips browser-like projects such as `jsdom` and `happy-dom`.
 *
 * @returns Vitest/Vite plugin instance.
 */
export function TypedPgVitestPlugin(): Plugin {
  return {
    name: 'typed-pg-vitest-plugin',
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
