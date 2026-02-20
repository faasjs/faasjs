import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { main } from '../index'

const tempDirs: string[] = []

async function createTempProject(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'faas-cli-'))
  tempDirs.push(root)

  await mkdir(join(root, 'src'), {
    recursive: true,
  })

  return root
}

async function writeFixture(filePath: string, content: string): Promise<void> {
  await mkdir(dirname(filePath), {
    recursive: true,
  })

  await writeFile(filePath, content)
}

afterEach(async () => {
  vi.restoreAllMocks()

  await Promise.all(
    tempDirs.splice(0).map((path) =>
      rm(path, {
        recursive: true,
        force: true,
      }),
    ),
  )
})

describe('faas cli', () => {
  it('should print help text', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', '--help'])

    expect(code).toBe(0)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Usage:'))
  })

  it('should print version text', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', '--version'])

    expect(code).toBe(0)
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/^v?\d+/))
  })

  it('should generate declaration files with root option', async () => {
    const root = await createTempProject()

    await writeFixture(
      join(root, 'src', 'faas.yaml'),
      `development:
  plugins:
    http:
      type: http
`,
    )
    await writeFixture(join(root, 'src', 'index.func.ts'), 'export const func = {} as any\n')

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const firstCode = await main(['node', 'faas', 'types', '--root', root])

    expect(firstCode).toBe(0)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[faas types] Generated'))

    const outputPath = join(root, 'src', '.faasjs', 'types.d.ts')
    const content = await readFile(outputPath, 'utf8')

    expect(content).toContain("declare module '@faasjs/types'")
    expect(content).toContain('"/": InferFaasAction<InferFaasFunc<typeof import("../index.func")>>')

    logSpy.mockClear()

    const secondCode = await main(['node', 'faas', 'types', '--root', root])

    expect(secondCode).toBe(0)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[faas types] Up to date'))
  })

  it('should return error code for unknown options', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'types', '--unknown'])

    expect(code).toBe(1)
    expect(errorSpy).toHaveBeenCalledWith('[faas types] Unknown option: --unknown')
  })

  it('should return error code for unexpected positional argument in types command', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'types', 'unexpected'])

    expect(code).toBe(1)
    expect(errorSpy).toHaveBeenCalledWith('[faas types] Unknown option: unexpected')
  })

  it('should print types help text', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'types', '--help'])

    expect(code).toBe(0)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Generate FaasJS API/event type declarations.'))
  })

  it('should print types version text', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'types', '--version'])

    expect(code).toBe(0)
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/^v?\d+/))
  })

  it('should return error code for unknown command', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'unknown'])

    expect(code).toBe(1)
    expect(errorSpy).toHaveBeenCalledWith('[faas] Unknown command: unknown')
  })
})
