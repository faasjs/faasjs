import { mkdir, mkdtemp, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { parseTsconfig } from '../../load-package'

describe('parseTsconfig', () => {
  const tempDirs: string[] = []

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

  it('should inherit relative configs and preserve the option source directory', async () => {
    const root = await mkdtemp(join(tmpdir(), 'faas-tsconfig-relative-'))
    tempDirs.push(root)

    await mkdir(join(root, 'configs'), { recursive: true })
    await mkdir(join(root, 'app'), { recursive: true })
    await writeFile(
      join(root, 'configs', 'base.json'),
      JSON.stringify({
        compilerOptions: {
          paths: {
            '@base/*': ['src/*'],
          },
        },
      }),
      'utf8',
    )
    await writeFile(
      join(root, 'app', 'tsconfig.json'),
      JSON.stringify({
        extends: '../configs/base',
      }),
      'utf8',
    )

    expect(parseTsconfig(join(root, 'app', 'tsconfig.json'))).toEqual({
      baseUrl: join(root, 'configs'),
      rules: [
        {
          key: '@base/*',
          targets: ['src/*'],
          hasWildcard: true,
          prefix: '@base/',
          suffix: '',
        },
      ],
    })
  })

  it('should resolve package configs and let child compiler options override them', async () => {
    const root = await mkdtemp(join(tmpdir(), 'faas-tsconfig-package-'))
    tempDirs.push(root)

    const packageRoot = join(root, 'node_modules', '@fixture', 'tsconfig')
    await mkdir(packageRoot, { recursive: true })
    await mkdir(join(root, 'app'), { recursive: true })
    await writeFile(
      join(packageRoot, 'package.json'),
      JSON.stringify({
        name: '@fixture/tsconfig',
        exports: './base.json',
      }),
      'utf8',
    )
    await writeFile(
      join(packageRoot, 'base.json'),
      JSON.stringify({
        compilerOptions: {
          baseUrl: './package-src',
          paths: {
            '@package/*': ['lib/*'],
          },
        },
      }),
      'utf8',
    )
    const canonicalPackageRoot = await realpath(packageRoot)
    await writeFile(
      join(root, 'app', 'tsconfig.json'),
      JSON.stringify({
        extends: '@fixture/tsconfig',
        compilerOptions: {
          baseUrl: './app-src',
          paths: {
            '@app/*': ['features/*'],
          },
        },
      }),
      'utf8',
    )
    await writeFile(
      join(root, 'app', 'inherited.json'),
      JSON.stringify({
        extends: '@fixture/tsconfig',
      }),
      'utf8',
    )

    expect(parseTsconfig(join(root, 'app', 'inherited.json'))).toEqual({
      baseUrl: join(canonicalPackageRoot, 'package-src'),
      rules: [
        {
          key: '@package/*',
          targets: ['lib/*'],
          hasWildcard: true,
          prefix: '@package/',
          suffix: '',
        },
      ],
    })

    expect(parseTsconfig(join(root, 'app', 'tsconfig.json'))).toEqual({
      baseUrl: join(root, 'app', 'app-src'),
      rules: [
        {
          key: '@app/*',
          targets: ['features/*'],
          hasWildcard: true,
          prefix: '@app/',
          suffix: '',
        },
      ],
    })
  })

  it('should apply multiple extended configs in order before child overrides', async () => {
    const root = await mkdtemp(join(tmpdir(), 'faas-tsconfig-multiple-'))
    tempDirs.push(root)

    await writeFile(
      join(root, 'first.json'),
      JSON.stringify({
        compilerOptions: {
          baseUrl: './first',
          paths: { '@first/*': ['*'] },
        },
      }),
      'utf8',
    )
    await writeFile(
      join(root, 'second.json'),
      JSON.stringify({
        compilerOptions: {
          baseUrl: './second',
          paths: { '@second/*': ['*'] },
        },
      }),
      'utf8',
    )
    await writeFile(
      join(root, 'tsconfig.json'),
      JSON.stringify({
        extends: ['./first.json', './second.json'],
      }),
      'utf8',
    )

    const parsed = parseTsconfig(join(root, 'tsconfig.json'))

    expect(parsed.baseUrl).toBe(join(root, 'second'))
    expect(parsed.rules.map((rule) => rule.key)).toEqual(['@second/*'])
  })

  it('should reject circular extends chains', async () => {
    const root = await mkdtemp(join(tmpdir(), 'faas-tsconfig-cycle-'))
    tempDirs.push(root)

    await writeFile(join(root, 'a.json'), JSON.stringify({ extends: './b.json' }), 'utf8')
    await writeFile(join(root, 'b.json'), JSON.stringify({ extends: './a.json' }), 'utf8')

    expect(() => parseTsconfig(join(root, 'a.json'))).toThrow(/circular tsconfig extends/i)
  })
})
