import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const testDir = dirname(fileURLToPath(import.meta.url))
const packageRoot = resolve(testDir, '..', '..')
const workspaceRoot = resolve(packageRoot, '..', '..')
const tmpRoot = join(workspaceRoot, 'tmp')
const npmCacheDir = join(tmpRoot, '.npm-cache')
const moduleRequire = createRequire(import.meta.url)
const vitestBin = join(dirname(moduleRequire.resolve('vitest/package.json')), 'vitest.mjs')

function run(command: string, args: string[], cwd: string) {
  mkdirSync(npmCacheDir, { recursive: true })

  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      FORCE_COLOR: '0',
      NPM_CONFIG_CACHE: npmCacheDir,
    },
  })
}

function packPackage(packageDir: string) {
  const tarballName = run('npm', ['pack', '--silent'], packageDir).trim()

  return join(packageDir, tarballName)
}

function buildWorkspacePackages() {
  run('npx', ['vp', 'pack'], workspaceRoot)
}

function writeConsumerFixture(consumerDir: string, options: { multiProject?: boolean } = {}) {
  const configLines = options.multiProject
    ? [
        "import { defineConfig } from 'vitest/config'",
        "import { TypedPgVitestPlugin } from '@faasjs/pg-dev'",
        '',
        'export default defineConfig({',
        '  plugins: [TypedPgVitestPlugin()],',
        '  test: {',
        '    projects: [',
        '      {',
        '        extends: true,',
        '        test: {',
        "          name: 'api',",
        "          environment: 'node',",
        "          include: ['test/**/*.test.ts'],",
        '        },',
        '      },',
        '    ],',
        '  },',
        '})',
        '',
      ]
    : [
        "import { defineConfig } from 'vitest/config'",
        "import { TypedPgVitestPlugin } from '@faasjs/pg-dev'",
        '',
        'export default defineConfig({',
        '  plugins: [TypedPgVitestPlugin()],',
        '  test: {',
        "    include: ['test/**/*.test.ts'],",
        '  },',
        '})',
        '',
      ]

  writeFileSync(
    join(consumerDir, 'package.json'),
    JSON.stringify(
      {
        name: 'typed-pg-dev-consumer-fixture',
        private: true,
        type: 'module',
      },
      undefined,
      2,
    ),
  )

  mkdirSync(join(consumerDir, 'migrations'), { recursive: true })
  mkdirSync(join(consumerDir, 'test'), { recursive: true })

  writeFileSync(join(consumerDir, 'vitest.config.ts'), configLines.join('\n'))

  writeFileSync(
    join(consumerDir, 'migrations', '20250101000000_create_users.ts'),
    [
      'export function up(builder: any) {',
      "  builder.createTable('users', (table: any) => {",
      "    table.number('id').primary()",
      "    table.string('name')",
      '  })',
      '}',
      '',
    ].join('\n'),
  )

  writeFileSync(
    join(consumerDir, 'test', 'plugin.test.ts'),
    [
      "import { getClient } from '@faasjs/pg'",
      "import { expect, it } from 'vitest'",
      '',
      "it('boots from the published package', async () => {",
      '  const client = await getClient()',
      '',
      '  expect(process.env.DATABASE_URL).toMatch(/^postgresql:/)',
      "  expect(await client.raw`SELECT to_regclass('public.users') AS name`).toEqual([{ name: 'users' }])",
      "  await client.raw`INSERT INTO users (id, name) VALUES (1, 'Alice')`",
      '  expect(await client.raw`SELECT COUNT(*)::integer AS count FROM users`).toEqual([{ count: 1 }])',
      '})',
      '',
    ].join('\n'),
  )
}

describe('typed-pg-dev published package', () => {
  it('works when installed as packed tarballs in a consumer project', () => {
    mkdirSync(tmpRoot, { recursive: true })

    const consumerDir = mkdtempSync(join(tmpRoot, 'typed-pg-dev-consumer-'))
    const typedPgDir = join(workspaceRoot, 'packages', 'pg')
    const typedPgDevDir = join(workspaceRoot, 'packages', 'pg-dev')

    writeConsumerFixture(consumerDir)

    buildWorkspacePackages()

    const typedPgTarball = packPackage(typedPgDir)
    const typedPgDevTarball = packPackage(typedPgDevDir)

    try {
      run('npm', ['install', '--ignore-scripts', typedPgTarball, typedPgDevTarball], consumerDir)

      const output = run(
        process.execPath,
        [vitestBin, 'run', '--config', 'vitest.config.ts'],
        consumerDir,
      )

      expect(output).toContain('1 passed')
      expect(
        existsSync(
          join(consumerDir, 'node_modules', '@faasjs/pg-dev', 'dist', 'typed-pg-vitest-setup.mjs'),
        ),
      ).toBe(true)
      expect(
        existsSync(
          join(
            consumerDir,
            'node_modules',
            '@faasjs/pg-dev',
            'dist',
            'typed-pg-vitest-global-setup.mjs',
          ),
        ),
      ).toBe(true)
    } finally {
      rmSync(typedPgTarball, { force: true })
      rmSync(typedPgDevTarball, { force: true })
      rmSync(consumerDir, { force: true, recursive: true })
    }
  }, 60_000)

  it('works from the published package in a multi-project Vitest config', () => {
    mkdirSync(tmpRoot, { recursive: true })

    const consumerDir = mkdtempSync(join(tmpRoot, 'typed-pg-dev-consumer-projects-'))
    const typedPgDir = join(workspaceRoot, 'packages', 'pg')
    const typedPgDevDir = join(workspaceRoot, 'packages', 'pg-dev')

    writeConsumerFixture(consumerDir, { multiProject: true })

    buildWorkspacePackages()

    const typedPgTarball = packPackage(typedPgDir)
    const typedPgDevTarball = packPackage(typedPgDevDir)

    try {
      run('npm', ['install', '--ignore-scripts', typedPgTarball, typedPgDevTarball], consumerDir)

      const output = run(
        process.execPath,
        [vitestBin, 'run', '--config', 'vitest.config.ts', '--project', 'api'],
        consumerDir,
      )

      expect(output).toContain('1 passed')
    } finally {
      rmSync(typedPgTarball, { force: true })
      rmSync(typedPgDevTarball, { force: true })
      rmSync(consumerDir, { force: true, recursive: true })
    }
  }, 60_000)
})
