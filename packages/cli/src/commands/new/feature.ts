import { join } from 'node:path'
import type { Command } from 'commander'
import {
  ensureDirectory,
  getPagesPath,
  normalizePath,
  toRouteKey,
  writeFile,
} from './utils'

function toComponentName(path: string): string {
  const parts = path
    .split('/')
    .flatMap(part => part.split(/[^a-zA-Z0-9]/g))
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))

  return `Feature${parts.join('') || 'Module'}`
}

export function action(name: string): void {
  const pagesPath = getPagesPath()
  ensureDirectory(pagesPath)

  const normalized = normalizePath(name)
  const featureRoot = join(pagesPath, ...normalized.split('/'))
  const componentName = toComponentName(normalized)

  writeFile(
    join(featureRoot, 'components', 'index.tsx'),
    `export function ${componentName}() {
  return <section>${normalized}</section>
}
`
  )

  const apiRelativePath = `${normalized}/api/index.func.ts`
  const routeKey = toRouteKey(apiRelativePath)

  writeFile(
    join(featureRoot, 'api', 'index.func.ts'),
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
    join(featureRoot, 'api', '__tests__', 'index.test.ts'),
    `import { test } from '@faasjs/test'
import { func } from '../index.func'

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

export function NewFeatureCommand(program: Command): void {
  program
    .command('feature <name>')
    .description('Generate feature module with components, api and tests')
    .action(action)
}
