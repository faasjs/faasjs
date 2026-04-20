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
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('run [options] <file>'))
    expect(logSpy).toHaveBeenCalledWith(expect.not.stringContaining('lint [options]'))
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
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Generate FaasJS API type declarations.'),
    )
  })

  it('should print types version text', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'types', '--version'])

    expect(code).toBe(0)
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/^v?\d+/))
  })

  it('should print run help text', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'run', '--help'])

    expect(code).toBe(0)
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Run a TypeScript file with FaasJS Node module hooks.'),
    )
  })

  it('should run a ts file with register hooks and forwarded args without auto-loading .env', async () => {
    const root = await createTempProject()
    const outputPath = join(root, 'run-output.json')
    const originalArgv1 = process.argv[1]
    const originalEnvValue = process.env.FAAS_RUN_TEST_MESSAGE

    await writeFixture(join(root, 'src', 'message.ts'), "export const message = 'ok'\n")
    await writeFixture(join(root, '.env'), 'FAAS_RUN_TEST_MESSAGE=from-dotenv\n')
    await writeFixture(
      join(root, 'runner.ts'),
      `import { writeFileSync } from 'node:fs'
import { message } from './src/message'

writeFileSync(${JSON.stringify(outputPath)}, JSON.stringify({
  args: process.argv.slice(2),
  env: process.env.FAAS_RUN_TEST_MESSAGE ?? null,
  message,
}))
`,
    )

    process.argv[1] = join(process.cwd(), 'packages', 'dev', 'faas.mjs')
    delete process.env.FAAS_RUN_TEST_MESSAGE

    try {
      const code = await main([
        'node',
        'faas',
        'run',
        '--root',
        root,
        'runner.ts',
        '--greeting',
        'hello',
      ])

      expect(code).toBe(0)
      expect(JSON.parse(await readFile(outputPath, 'utf8'))).toEqual({
        args: ['--greeting', 'hello'],
        env: null,
        message: 'ok',
      })
    } finally {
      process.argv[1] = originalArgv1

      if (originalEnvValue === undefined) delete process.env.FAAS_RUN_TEST_MESSAGE
      else process.env.FAAS_RUN_TEST_MESSAGE = originalEnvValue
    }
  })

  it('should return error code when run command is missing file name', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'run'])

    expect(code).toBe(1)
    expect(errorSpy).toHaveBeenCalledWith('[faas run] Missing file name')
  })

  it('should return error code for unknown command', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'unknown'])

    expect(code).toBe(1)
    expect(errorSpy).toHaveBeenCalledWith('[faas] Unknown command: unknown')
  })

  it('should return error code for lint command', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const code = await main(['node', 'faas', 'lint'])

    expect(code).toBe(1)
    expect(errorSpy).toHaveBeenCalledWith('[faas] Unknown command: lint')
  })
})
