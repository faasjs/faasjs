import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

import { Logger } from '@faasjs/node-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { generateFaasTypes, isTypegenInputFile } from '..'

const tempDirs: string[] = []
const originalFaasLog = process.env.FaasLog

async function createTempProject(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'faasjs-typegen-'))
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

beforeEach(() => {
  process.env.FaasLog = 'error'
})

afterEach(async () => {
  if (typeof originalFaasLog === 'string') process.env.FaasLog = originalFaasLog
  else delete process.env.FaasLog

  await Promise.all(
    tempDirs.splice(0).map((path) =>
      rm(path, {
        recursive: true,
        force: true,
      }),
    ),
  )
})

describe('typegen', () => {
  it('should generate route action map from api files', async () => {
    const root = await createTempProject()
    const logger = new Logger('typegen:test')
    logger.silent = true

    await writeFixture(
      join(root, 'src', 'faas.yaml'),
      `development:
  plugins:
    http:
      type: http
    custom:
      type: custom
`,
    )
    await writeFixture(join(root, 'src', 'index.api.ts'), 'export default {} as any\n')
    await writeFixture(join(root, 'src', 'default.api.ts'), 'export default {} as any\n')
    await writeFixture(join(root, 'src', 'posts.api.ts'), 'export default {} as any\n')
    await writeFixture(join(root, 'src', 'posts', 'index.api.ts'), 'export default {} as any\n')
    await writeFixture(
      join(root, 'src', 'users', 'faas.yaml'),
      `development:
  plugins:
    custom:
      type: admin
`,
    )
    await writeFixture(join(root, 'src', 'users', 'default.api.ts'), 'export default {} as any\n')
    await writeFixture(join(root, 'src', 'users', 'profile.api.ts'), 'export default {} as any\n')

    const result = await generateFaasTypes({
      root,
      logger,
    })

    expect(result.changed).toBe(true)
    expect(result.output).toBe(join(root, 'src', '.faasjs', 'types.d.ts'))
    expect(result.fileCount).toBe(6)
    expect(result.routeCount).toBe(5)

    const content = await readFile(result.output, 'utf8')

    expect(content).toContain('"*": InferFaasAction<InferFaasApi<typeof import("../default.api")>>')
    expect(content).toContain('"/": InferFaasAction<InferFaasApi<typeof import("../index.api")>>')
    expect(content).toContain(
      '"posts": InferFaasAction<InferFaasApi<typeof import("../posts.api")>>',
    )
    expect(content).toContain(
      '"users/*": InferFaasAction<InferFaasApi<typeof import("../users/default.api")>>',
    )
    expect(content).toContain(
      '"users/profile": InferFaasAction<InferFaasApi<typeof import("../users/profile.api")>>',
    )
    expect(content).not.toContain('import("../posts/index.api")')

    const second = await generateFaasTypes({
      root,
      logger,
    })

    expect(second.changed).toBe(false)
    expect(second.fileCount).toBe(6)
    expect(second.routeCount).toBe(5)
  })

  it('should throw when source directory does not exist', async () => {
    const root = await createTempProject()
    const logger = new Logger('typegen:test')
    logger.silent = true

    await expect(
      generateFaasTypes({
        root: join(root, 'api'),
        logger,
      }),
    ).rejects.toThrow('[faas types] Source directory not found:')
  })

  it('should resolve source directory from defaults.server.root', async () => {
    const root = await createTempProject()
    const logger = new Logger('typegen:test')
    logger.silent = true

    await writeFixture(
      join(root, 'src', 'faas.yaml'),
      `defaults:
  server:
    root: app
`,
    )
    await writeFixture(join(root, 'app', 'src', 'index.api.ts'), 'export default {} as any\n')

    const result = await generateFaasTypes({
      root,
      logger,
    })

    expect(result.output).toBe(join(root, 'app', 'src', '.faasjs', 'types.d.ts'))
    expect(result.fileCount).toBe(1)
    expect(result.routeCount).toBe(1)
  })

  it('should detect typegen input files', () => {
    expect(isTypegenInputFile('/tmp/app/src/demo.api.ts')).toBe(true)
    expect(isTypegenInputFile('/tmp/app/src/faas.yaml')).toBe(true)
    expect(isTypegenInputFile('C:\\repo\\src\\faas.yml')).toBe(true)
    expect(isTypegenInputFile('/tmp/app/src/demo.ts')).toBe(false)
  })
})
