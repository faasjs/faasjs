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
  it.each([
    [
      'help text',
      ['node', 'faas', '--help'],
      ['Usage:', 'run [options] <file>'],
      ['lint [options]'],
    ],
    [
      'types help text',
      ['node', 'faas', 'types', '--help'],
      ['Generate FaasJS API type declarations.'],
      [],
    ],
    [
      'run help text',
      ['node', 'faas', 'run', '--help'],
      ['Run a TypeScript file with FaasJS Node module hooks.'],
      [],
    ],
  ] as const)('should print %s', async (_, argv, expectedMessages, unexpectedMessages) => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(Array.from(argv))

    expect(code).toBe(0)

    for (const message of expectedMessages)
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(message))
    for (const message of unexpectedMessages)
      expect(logSpy).toHaveBeenCalledWith(expect.not.stringContaining(message))
  })

  it.each([
    ['version text', ['node', 'faas', '--version']],
    ['types version text', ['node', 'faas', 'types', '--version']],
  ] as const)('should print %s', async (_, argv) => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const code = await main(Array.from(argv))

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
    await writeFixture(join(root, 'src', 'index.api.ts'), 'export default {} as any\n')

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined)

    const firstCode = await main(['node', 'faas', 'types', '--root', root])

    expect(firstCode).toBe(0)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[faas types] Generated'))

    const outputPath = join(root, 'src', '.faasjs', 'types.d.ts')
    const content = await readFile(outputPath, 'utf8')

    expect(content).toContain("declare module '@faasjs/types'")
    expect(content).toContain('"/": InferFaasAction<typeof import("../index.api")>')

    logSpy.mockClear()

    const secondCode = await main(['node', 'faas', 'types', '--root', root])

    expect(secondCode).toBe(0)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[faas types] Up to date'))
  })

  it('should run a ts file with register hooks and forwarded args without auto-loading .env', async () => {
    const root = await createTempProject()
    const outputPath = join(root, 'run-output.json')
    const originalEnvValue = process.env.FAAS_RUN_TEST_MESSAGE
    const faasBin = join(process.cwd(), 'packages', 'dev', 'faas.mjs')

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

    delete process.env.FAAS_RUN_TEST_MESSAGE

    try {
      const code = await main([
        'node',
        faasBin,
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
      if (originalEnvValue === undefined) delete process.env.FAAS_RUN_TEST_MESSAGE
      else process.env.FAAS_RUN_TEST_MESSAGE = originalEnvValue
    }
  })

  it.each([
    [
      'unknown options',
      ['node', 'faas', 'types', '--unknown'],
      '[faas types] Unknown option: --unknown',
    ],
    [
      'unexpected positional argument in types command',
      ['node', 'faas', 'types', 'unexpected'],
      '[faas types] Unknown option: unexpected',
    ],
    ['missing run file name', ['node', 'faas', 'run'], '[faas run] Missing file name'],
    ['unknown command', ['node', 'faas', 'unknown'], '[faas] Unknown command: unknown'],
    ['lint command', ['node', 'faas', 'lint'], '[faas] Unknown command: lint'],
  ] as const)('should return error code for %s', async (_, argv, message) => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const code = await main(Array.from(argv))

    expect(code).toBe(1)
    expect(errorSpy).toHaveBeenCalledWith(message)
  })
})
