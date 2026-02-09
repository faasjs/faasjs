import { join } from 'node:path'
import type { Command } from 'commander'
import {
  ensureDirectory,
  getPagesPath,
  normalizePath,
  toRouteKey,
  writeFile,
} from './utils'

function resolveApiPath(name: string): string {
  const normalized = normalizePath(name)

  const parts = normalized.split('/').filter(Boolean)
  let filename = parts.pop() as string

  if (filename.endsWith('.func.ts'))
    filename = filename.replace(/\.func\.ts$/, '')
  else if (filename.endsWith('.ts')) filename = filename.replace(/\.ts$/, '')

  if (parts[parts.length - 1] !== 'api') parts.push('api')

  return [...parts, `${filename}.func.ts`].join('/')
}

export function action(name: string): void {
  const pagesPath = getPagesPath()
  ensureDirectory(pagesPath)

  const relativePath = resolveApiPath(name)
  const routeKey = toRouteKey(relativePath)
  const filename = relativePath.split('/').at(-1) as string
  const filenameWithoutTs = filename.replace('.ts', '')
  const filenameWithoutFunc = filename.replace('.func.ts', '')

  const filePath = join(pagesPath, ...relativePath.split('/'))
  const testPath = join(
    pagesPath,
    ...relativePath.replace('.func.ts', '').split('/').slice(0, -1),
    '__tests__',
    `${filenameWithoutFunc}.test.ts`
  )

  writeFile(
    filePath,
    `import { useHttpFunc } from '@faasjs/http'
import type { InferFaasAction } from '@faasjs/types'
import { z } from 'zod'

const schema = z.object({}).required()

export const func = useHttpFunc<z.infer<typeof schema>>(() => {
  return async ({ params }) => {
    const parsed = schema.parse(params || {})

    return {
      ok: true,
      data: parsed,
      error: null,
    }
  }
})

declare module '@faasjs/types' {
  interface FaasActions {
    '${routeKey}': InferFaasAction<typeof func>
  }
}
`
  )

  writeFile(
    testPath,
    `import { test } from '@faasjs/test'
import { func } from '../${filenameWithoutTs}'

describe('${routeKey}', () => {
  it('should work', async () => {
    const testFunc = test(func)

    const { statusCode, data } = await testFunc.JSONhandler({})

    expect(statusCode).toBe(200)
    expect(data).toEqual({
      ok: true,
      data: {},
      error: null,
    })
  })
})
`
  )
}

export function NewApiCommand(program: Command): void {
  program
    .command('api <name>')
    .description('Generate api file in src/pages/**/api/*.func.ts')
    .action(action)
}
