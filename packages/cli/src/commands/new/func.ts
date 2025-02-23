import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, sep } from 'node:path'
import { Logger } from '@faasjs/logger'

const Plugins: {
  [key: string]: {
    name: string
    kls: string
    key: string
  }
} = {
  cf: {
    name: '@faasjs/cloud_function',
    kls: 'CloudFunction',
    key: 'cf',
  },
  http: {
    name: '@faasjs/http',
    kls: 'Http',
    key: 'http',
  },
  redis: {
    name: '@faasjs/redis',
    kls: 'Redis',
    key: 'redis',
  },
  knex: {
    name: '@faasjs/knex',
    kls: 'Knex',
    key: 'knex',
  },
}

export default function (name: string, plugins: string[]): void {
  const logger = new Logger()

  let folder = ''
  if (name.includes(sep)) {
    const folders = name.split(sep)
    name = folders.pop()
    folders.reduce((prev: string, cur: string) => {
      if (!existsSync(prev)) mkdirSync(prev)
      cur = join(prev, cur)
      if (!existsSync(cur)) mkdirSync(cur)
      return cur
    })
    folder = join(...folders)
  }

  if (!name.endsWith('.func.ts')) name += '.func.ts'

  if (existsSync(join(folder, name))) {
    logger.error(`File exists ${join(folder, name)}.`)
    return
  }

  let imports = "import { useFunc } from '@faasjs/func'\n"
  let initials = ''
  const funcPluginNames = []

  for (const plugin of plugins) {
    let info = Plugins[plugin.toLowerCase()]
    if (!info) {
      const kls = plugin
        .replace(/@[^/]+\//, '')
        .replace('/', '')
        .replace('-', '')
      info = {
        name: plugin,
        kls,
        key: kls.toLowerCase(),
      }
    }
    imports += `import { use${info.kls} } from '${info.name}'\n`
    initials += `  const ${info.key} = use${info.kls}()\n`
    funcPluginNames.push(info.key)
  }

  logger.info(`Writing ${join(folder, name)}`)
  writeFileSync(
    join(folder, name),
    `${imports}\nexport const func = useFunc(function () {
${initials}
  return async function () {
    // let's code
  }
})
`
  )

  if (!existsSync(join(folder, '__tests__')))
    mkdirSync(join(folder, '__tests__'))

  const testFile = join(
    folder,
    '__tests__',
    name.replace('.func.ts', '.test.ts')
  )
  if (!existsSync(testFile)) {
    logger.info(`Writing ${testFile}`)
    writeFileSync(
      testFile,
      `import { FuncWarper } from '@faasjs/test'
import { func } from '../${name.replace('.ts', '')}'

describe('${name}', function () {
  test('should work', async function () {
    const testFunc = new FuncWarper(func)

    const res = await testFunc.handler({})

    expect(res).toEqual({})
  })
})
`
    )
  }

  logger.info('Done.')
}
