import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { afterEach, describe, expect, it } from 'vitest'

import { loadJobRegistry } from '../../discovery'

const tempDirs: string[] = []

describe('job runtime context', () => {
  afterEach(async () => {
    await Promise.all(
      tempDirs.splice(0).map((path) =>
        rm(path, {
          recursive: true,
          force: true,
        }),
      ),
    )
  })

  it('keeps job params when an inherited http plugin is loaded', async () => {
    const projectRoot = await mkdtemp(join(tmpdir(), 'faas-jobs-runtime-'))
    const src = join(projectRoot, 'src')
    const jobs = join(src, 'jobs')

    tempDirs.push(projectRoot)

    await mkdir(jobs, {
      recursive: true,
    })
    await writeFile(
      join(src, 'faas.yaml'),
      `defaults:
  plugins:
    http:
      type: http
      config:
        cookie:
          session:
            secret: test-secret
`,
      'utf8',
    )
    await writeFile(
      join(jobs, 'inherited-http.job.ts'),
      `import { defineJob } from ${JSON.stringify(pathToFileURL(resolve(__dirname, '../../index.ts')).href)}
import { z } from ${JSON.stringify(pathToFileURL(resolve(__dirname, '../../../../utils/src/index.ts')).href)}

export default defineJob({
  schema: z.object({
    message: z.string(),
  }),
  async handler(data) {
    return {
      params: data.params,
      eventParams: data.event.params,
      runtime: data.context.runtime,
      hasHttpHelpers: typeof data.setBody === 'function',
    }
  },
})
`,
      'utf8',
    )

    const registry = await loadJobRegistry({
      root: src,
    })
    const job = registry.get('jobs/inherited-http')

    expect(job).toBeDefined()
    expect(job?.plugins.some((plugin) => plugin.type === 'http')).toEqual(true)

    const result = await job!.export().handler({
      params: {
        message: 'keep',
      },
      queryString: {
        message: 'from-http',
      },
    } as any)

    expect(result).toEqual({
      params: {
        message: 'keep',
      },
      eventParams: {
        message: 'keep',
      },
      runtime: 'job',
      hasHttpHelpers: false,
    })
  })
})
