import { describe, expect, expectTypeOf, it } from 'vitest'

import { PgVitestPlugin } from '../../plugin'
import {
  requirePgVitestDatabaseUrl,
  resolvePgVitestDatabaseUrl,
  resolvePgVitestWorkerId,
} from '../../plugin-context'

function resolvePluginId(plugin: ReturnType<typeof PgVitestPlugin>, id: string) {
  const resolveId = plugin.resolveId as ((id: string) => string | undefined) | undefined

  return resolveId?.(id)
}

function loadPluginModule(plugin: ReturnType<typeof PgVitestPlugin>, id: string) {
  const load = plugin.load as ((id: string) => string | undefined) | undefined

  return load?.(id)
}

describe('PgVitestPlugin', () => {
  it('does not accept options', () => {
    expectTypeOf(PgVitestPlugin).parameters.toEqualTypeOf<[]>()
  })

  it('injects generated Vitest setup modules for node projects', () => {
    const plugin = PgVitestPlugin()
    const project = {
      config: {
        environment: 'node',
        fileParallelism: true,
        setupFiles: ['custom-setup.ts'],
      },
    }

    plugin.configureVitest?.({
      experimental_defineCacheKeyGenerator() {},
      injectTestProjects: async () => [],
      project: project as never,
      vitest: {} as never,
    })

    expect(project.config.fileParallelism).toBe(true)
    expect(project.config.setupFiles[0]).toMatch(/^virtual:faasjs-pg-dev\/vitest-setup:/)
    expect(project.config.setupFiles[1]).toBe('custom-setup.ts')
  })

  it('deduplicates setup entries when configureVitest runs more than once', () => {
    const plugin = PgVitestPlugin()
    const project = {
      config: {
        environment: 'node',
        setupFiles: 'custom-setup.ts',
      },
    }

    plugin.configureVitest?.({
      experimental_defineCacheKeyGenerator() {},
      injectTestProjects: async () => [],
      project: project as never,
      vitest: {} as never,
    })
    plugin.configureVitest?.({
      experimental_defineCacheKeyGenerator() {},
      injectTestProjects: async () => [],
      project: project as never,
      vitest: {} as never,
    })

    expect(project.config.setupFiles).toHaveLength(2)
    expect(project.config.setupFiles[0]).toMatch(/^virtual:faasjs-pg-dev\/vitest-setup:/)
    expect(project.config.setupFiles[1]).toBe('custom-setup.ts')
  })

  it('skips browser-like projects by default', () => {
    const plugin = PgVitestPlugin()
    const project = {
      config: {
        environment: 'jsdom',
        setupFiles: ['custom-setup.ts'],
      },
    }

    plugin.configureVitest?.({
      experimental_defineCacheKeyGenerator() {},
      injectTestProjects: async () => [],
      project: project as never,
      vitest: {} as never,
    })

    expect(project.config.setupFiles).toEqual(['custom-setup.ts'])
  })

  it('can generate a setup module that wires the shared setup helper', () => {
    const plugin = PgVitestPlugin()
    const project = {
      config: {
        environment: 'node',
        root: '/repo/project',
        setupFiles: [],
      },
    }

    plugin.configureVitest?.({
      experimental_defineCacheKeyGenerator() {},
      injectTestProjects: async () => [],
      project: project as never,
      vitest: {} as never,
    })

    const generatedSetupId = project.config.setupFiles[0] as string
    const resolvedSetupId = resolvePluginId(plugin, generatedSetupId)
    const generatedSource = loadPluginModule(plugin, `\0${generatedSetupId}`)

    expect(resolvedSetupId).toBe(`\0${generatedSetupId}`)
    expect(generatedSource).toContain("import { afterAll, beforeEach } from 'vitest'")
    expect(generatedSource).toContain('import { setupPgVitest } from')
    expect(generatedSource).toContain('  { afterAll, beforeEach, projectRoot: "/repo/project" },')
  })

  it('uses the Vitest pool id when resolving a worker id', () => {
    expect(
      resolvePgVitestWorkerId({
        VITEST_POOL_ID: '2',
      }),
    ).toBe('2')
  })

  it('throws when the Vitest pool id is missing', () => {
    expect(() => resolvePgVitestWorkerId({})).toThrow(/VITEST_POOL_ID/)
  })

  it('returns undefined when the current worker id is missing', () => {
    expect(
      resolvePgVitestDatabaseUrl(
        {
          '1': 'postgresql://worker-1',
          '2': 'postgresql://worker-2',
        },
        '999',
      ),
    ).toBeUndefined()
  })

  it('throws a helpful error when no worker database url is available', () => {
    expect(() => requirePgVitestDatabaseUrl(undefined, '3')).toThrow(/worker 3/)
    expect(() => requirePgVitestDatabaseUrl({ '1': 'postgresql://worker-1' }, '3')).toThrow(
      /worker 3/,
    )
  })
})
