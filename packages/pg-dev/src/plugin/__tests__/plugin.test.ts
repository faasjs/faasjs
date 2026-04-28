import { describe, expect, expectTypeOf, it } from 'vitest'

import { TypedPgVitestPlugin } from '../../plugin'
import {
  requireTypedPgVitestDatabaseUrl,
  resolveTypedPgVitestDatabaseUrl,
  resolveTypedPgVitestWorkerId,
} from '../../plugin-context'

function resolvePluginId(plugin: ReturnType<typeof TypedPgVitestPlugin>, id: string) {
  const resolveId = plugin.resolveId as ((id: string) => string | undefined) | undefined

  return resolveId?.(id)
}

function loadPluginModule(plugin: ReturnType<typeof TypedPgVitestPlugin>, id: string) {
  const load = plugin.load as ((id: string) => string | undefined) | undefined

  return load?.(id)
}

describe('TypedPgVitestPlugin', () => {
  it('does not accept options', () => {
    expectTypeOf(TypedPgVitestPlugin).parameters.toEqualTypeOf<[]>()
  })

  it('injects generated Vitest setup modules for node projects', () => {
    const plugin = TypedPgVitestPlugin()
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
    expect(project.config.setupFiles[0]).toMatch(/^virtual:typed-pg-dev\/vitest-setup:/)
    expect(project.config.setupFiles[1]).toBe('custom-setup.ts')
  })

  it('deduplicates setup entries when configureVitest runs more than once', () => {
    const plugin = TypedPgVitestPlugin()
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
    expect(project.config.setupFiles[0]).toMatch(/^virtual:typed-pg-dev\/vitest-setup:/)
    expect(project.config.setupFiles[1]).toBe('custom-setup.ts')
  })

  it('skips browser-like projects by default', () => {
    const plugin = TypedPgVitestPlugin()
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
    const plugin = TypedPgVitestPlugin()
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
    expect(generatedSource).toContain('import { setupTypedPgVitest } from')
    expect(generatedSource).toContain('  { afterAll, beforeEach, projectRoot: "/repo/project" },')
  })

  it('uses the Vitest pool id when resolving a worker id', () => {
    expect(
      resolveTypedPgVitestWorkerId({
        VITEST_POOL_ID: '2',
      }),
    ).toBe('2')
  })

  it('throws when the Vitest pool id is missing', () => {
    expect(() => resolveTypedPgVitestWorkerId({})).toThrow(/VITEST_POOL_ID/)
  })

  it('returns undefined when the current worker id is missing', () => {
    expect(
      resolveTypedPgVitestDatabaseUrl(
        {
          '1': 'postgresql://worker-1',
          '2': 'postgresql://worker-2',
        },
        '999',
      ),
    ).toBeUndefined()
  })

  it('throws a helpful error when no worker database url is available', () => {
    expect(() => requireTypedPgVitestDatabaseUrl(undefined, '3')).toThrow(/worker 3/)
    expect(() => requireTypedPgVitestDatabaseUrl({ '1': 'postgresql://worker-1' }, '3')).toThrow(
      /worker 3/,
    )
  })
})
