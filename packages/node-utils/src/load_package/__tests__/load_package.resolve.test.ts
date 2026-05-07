import { realpathSync } from 'node:fs'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let capturedResolve: ((specifier: string, context: any, nextResolve: any) => any) | undefined

vi.mock('node:module', () => ({
  registerHooks(options: { resolve: typeof capturedResolve }) {
    capturedResolve = options.resolve
  },
}))

async function importLoadPackage() {
  capturedResolve = undefined
  vi.resetModules()

  return import('../../load_package')
}

function expectResolvedToFile(result: { shortCircuit?: boolean; url: string }, filePath: string) {
  const resolvedUrl = new URL(result.url)
  const resolvedPath = new URL(result.url)

  resolvedPath.search = ''

  expect(result.shortCircuit).toBe(true)
  expect(realpathSync.native(fileURLToPath(resolvedPath))).toBe(realpathSync.native(filePath))

  return resolvedUrl
}

describe('loadPackage resolver internals', () => {
  const tempDirs: string[] = []
  let originalArgv: string[]

  beforeEach(() => {
    originalArgv = process.argv.slice()
  })

  afterEach(async () => {
    process.argv = originalArgv

    await Promise.all(
      tempDirs.splice(0).map((path) =>
        rm(path, {
          recursive: true,
          force: true,
        }),
      ),
    )
  })

  it('should resolve aliases, directories, and versioned fallback URLs', async () => {
    const root = await mkdtemp(join(tmpdir(), 'faas-load-package-resolver-'))
    tempDirs.push(root)

    await mkdir(join(root, 'src', 'dir'), {
      recursive: true,
    })
    await mkdir(join(root, 'src', 'lib', 'message'), {
      recursive: true,
    })

    await writeFile(
      join(root, 'tsconfig.json'),
      `{
  // comments and trailing commas should still parse
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@shared/*": ["lib/*",],
      "@exact": ["lib/exact.ts",],
      "@ignored": "lib/ignored.ts",
      "@skip**": ["lib/ignored.ts"],
    },
  },
}
`,
      'utf8',
    )
    await writeFile(join(root, 'src', 'direct.ts'), `export const direct = 'direct'\n`, 'utf8')
    await writeFile(join(root, 'src', 'dir', 'index.ts'), `export const dir = 'dir'\n`, 'utf8')
    await writeFile(join(root, 'src', 'entry.ts'), `export const entry = 'entry'\n`, 'utf8')
    await writeFile(
      join(root, 'src', 'lib', 'message', 'index.ts'),
      `export const message = 'message'\n`,
      'utf8',
    )
    await writeFile(join(root, 'src', 'lib', 'exact.ts'), `export const exact = 'exact'\n`, 'utf8')

    const { registerNodeModuleHooks } = await importLoadPackage()

    registerNodeModuleHooks({
      entry: join(root, 'src', 'entry.ts'),
      version: '42',
    })

    expect(capturedResolve).toBeTypeOf('function')

    const parentURL = pathToFileURL(join(root, 'src', 'entry.ts')).href
    const resolve = capturedResolve!

    const wildcardAlias = expectResolvedToFile(
      resolve('@shared/message', { parentURL }, vi.fn()),
      join(root, 'src', 'lib', 'message', 'index.ts'),
    )
    const exactAlias = expectResolvedToFile(
      resolve('@exact', { parentURL }, vi.fn()),
      join(root, 'src', 'lib', 'exact.ts'),
    )
    const relativeDirectory = expectResolvedToFile(
      resolve('./dir', { parentURL }, vi.fn()),
      join(root, 'src', 'dir', 'index.ts'),
    )
    const absoluteFile = expectResolvedToFile(
      resolve(join(root, 'src', 'direct.ts'), { parentURL }, vi.fn()),
      join(root, 'src', 'direct.ts'),
    )

    expect(wildcardAlias.searchParams.get('faasjsv')).toBe('42')
    expect(exactAlias.searchParams.get('faasjsv')).toBe('42')
    expect(relativeDirectory.searchParams.get('faasjsv')).toBe('42')
    expect(absoluteFile.searchParams.get('faasjsv')).toBe('42')

    const nextInsideRoot = vi.fn<() => any>(() => ({
      url: pathToFileURL(join(root, 'src', 'direct.ts')).href,
    }))
    const versionedFallback = resolve('node:path', { parentURL }, nextInsideRoot)
    const versionedFallbackUrl = new URL(versionedFallback.url)

    expect(nextInsideRoot).toHaveBeenCalledWith('node:path', { parentURL })
    expect(versionedFallbackUrl.pathname).toBe(
      pathToFileURL(join(root, 'src', 'direct.ts')).pathname,
    )
    expect(versionedFallbackUrl.searchParams.get('faasjsv')).toBe('42')

    const outsideRootPath = join(dirname(root), 'outside.js')
    const nextOutsideRoot = vi.fn<() => any>(() => ({
      url: pathToFileURL(outsideRootPath).href,
    }))
    const outsideFallback = resolve(
      'data:text/javascript,export default 1',
      { parentURL },
      nextOutsideRoot,
    )

    expect(nextOutsideRoot).toHaveBeenCalledWith('data:text/javascript,export default 1', {
      parentURL,
    })
    expect(outsideFallback.url).toBe(pathToFileURL(outsideRootPath).href)

    const nextWithoutState = vi.fn<() => any>(() => ({ url: 'node:fs' }))
    expect(resolve('file://%', {}, nextWithoutState)).toEqual({
      url: 'node:fs',
    })
    expect(nextWithoutState).toHaveBeenCalledWith('file://%', {})
  })

  it('should derive a loader root from process.argv when tsconfig is missing', async () => {
    const root = await mkdtemp(join(tmpdir(), 'faas-load-package-runtime-entry-'))
    tempDirs.push(root)

    await mkdir(join(root, 'src'), {
      recursive: true,
    })
    await writeFile(join(root, 'server.ts'), `export const server = 'server'\n`, 'utf8')
    await writeFile(join(root, 'src', 'message.ts'), `export const message = 'ok'\n`, 'utf8')

    process.argv = ['node', join(root, 'server.ts')]

    const { registerNodeModuleHooks } = await importLoadPackage()

    registerNodeModuleHooks()

    expect(capturedResolve).toBeTypeOf('function')

    const result = capturedResolve!(
      './src/message',
      {
        parentURL: pathToFileURL(join(root, 'server.ts')).href,
      },
      vi.fn(),
    )

    expectResolvedToFile(result, join(root, 'src', 'message.ts'))
  })

  it('should ignore an invalid file URL entry and keep the runtime entry fallback', async () => {
    const root = await mkdtemp(join(tmpdir(), 'faas-load-package-invalid-entry-'))
    tempDirs.push(root)

    await mkdir(join(root, 'src'), {
      recursive: true,
    })
    await writeFile(join(root, 'server.ts'), `export const server = 'server'\n`, 'utf8')
    await writeFile(join(root, 'src', 'message.ts'), `export const message = 'ok'\n`, 'utf8')

    process.argv = ['node', join(root, 'server.ts')]

    const { registerNodeModuleHooks } = await importLoadPackage()

    registerNodeModuleHooks({
      entry: 'file://%',
    })

    expect(capturedResolve).toBeTypeOf('function')

    const result = capturedResolve!(
      './src/message',
      {
        parentURL: pathToFileURL(join(root, 'server.ts')).href,
      },
      vi.fn(),
    )

    expectResolvedToFile(result, join(root, 'src', 'message.ts'))
  })
})
