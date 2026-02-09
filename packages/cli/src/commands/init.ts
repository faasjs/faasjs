import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { Logger } from '@faasjs/logger'
import type { Command } from 'commander'
import { getRootPath } from '../helper'

const logger = new Logger('Cli:init')

type InitOptions = {
  force?: boolean
}

function writeFile(path: string, content: string, force = false): void {
  if (existsSync(path) && !force) return

  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)
  logger.info('Created %s', path)
}

function ensureTargetDirectory(rootPath: string, force = false): void {
  if (!existsSync(rootPath)) {
    mkdirSync(rootPath, { recursive: true })
    return
  }

  if (!force && readdirSync(rootPath).length > 0)
    throw Error(
      `Directory is not empty: ${rootPath}. Use --force to initialize anyway.`
    )
}

export function action(name: string | undefined, opts: InitOptions): void {
  const rootPath = name ? resolve(process.cwd(), name) : getRootPath()

  ensureTargetDirectory(rootPath, opts.force)

  const projectName = basename(rootPath)

  writeFile(
    join(rootPath, '.gitignore'),
    `node_modules/
dist/
coverage/
`,
    opts.force
  )

  writeFile(
    join(rootPath, 'package.json'),
    `${JSON.stringify(
      {
        name: projectName,
        private: true,
        type: 'module',
        version: '1.0.0',
        scripts: {
          dev: 'faas dev',
          build: 'faas build',
          start: 'faas start',
          check: 'faas check',
          test: 'vitest run',
        },
        dependencies: {
          '@faasjs/http': '*',
          faasjs: '*',
          react: '*',
          'react-dom': '*',
          zod: '*',
        },
        devDependencies: {
          '@biomejs/biome': '*',
          '@faasjs/lint': '*',
          '@faasjs/test': '*',
          '@faasjs/vite': '*',
          '@types/node': '*',
          '@types/react': '*',
          '@types/react-dom': '*',
          '@vitejs/plugin-react': '*',
          jsdom: '*',
          typescript: '*',
          vite: '*',
          vitest: '*',
        },
      },
      null,
      2
    )}
`,
    opts.force
  )

  writeFile(
    join(rootPath, 'tsconfig.json'),
    `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "types": ["vitest/globals"]
  },
  "include": ["src", "vite.config.ts", "server.ts"]
}
`,
    opts.force
  )

  writeFile(
    join(rootPath, 'biome.json'),
    `{
  "extends": ["@faasjs/lint/biome"]
}
`,
    opts.force
  )

  writeFile(
    join(rootPath, 'index.html'),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FaasJS App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
    opts.force
  )

  writeFile(
    join(rootPath, 'vite.config.ts'),
    `import { viteFaasJsServer } from '@faasjs/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  plugins: [react(), viteFaasJsServer()],
})
`,
    opts.force
  )

  writeFile(
    join(rootPath, 'server.ts'),
    `import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Server, staticHandler } from '@faasjs/server'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const publicHandler = staticHandler({
  root: join(__dirname, 'public'),
  notFound: false,
})

const distHandler = staticHandler({
  root: join(__dirname, 'dist'),
  notFound: 'index.html',
})

new Server(join(__dirname, 'src'), {
  beforeHandle: async (req, res, ctx) => {
    if (!req.url || req.method !== 'GET') return

    await publicHandler(req, res, ctx)
    await distHandler(req, res, ctx)
  },
}).listen()
`,
    opts.force
  )

  writeFile(
    join(rootPath, 'src', 'faas.yaml'),
    `defaults:
  plugins:
    http:
      config:
        cookie:
          secure: false
          session:
            secret: secret
development:
testing:
production:
`,
    opts.force
  )

  writeFile(
    join(rootPath, 'src', 'main.tsx'),
    `import { createRoot } from 'react-dom/client'
import HomePage from './pages/home'

createRoot(document.getElementById('root') as HTMLElement).render(<HomePage />)
`,
    opts.force
  )

  writeFile(
    join(rootPath, 'src', 'pages', 'home', 'index.tsx'),
    `import { useState } from 'react'

type ApiResponse = {
  ok: boolean
  data: string
  error: null | {
    code?: string
    message: string
  }
}

export default function HomePage() {
  const [message, setMessage] = useState('Click button to call API')
  const [loading, setLoading] = useState(false)

  const fetchMessage = async () => {
    setLoading(true)

    try {
      const data = await fetch('/home/api/hello', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'world' }),
      }).then(res => res.json() as Promise<ApiResponse>)

      if (data.ok) setMessage(data.data)
      else setMessage(data.error?.message || 'Unknown error')
    } catch (error: any) {
      setMessage(error?.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ margin: '5rem auto', maxWidth: 420, padding: 24 }}>
      <h1>FaasJS Starter</h1>
      <p>{message}</p>
      <button type="button" onClick={fetchMessage} disabled={loading}>
        {loading ? 'Loading...' : 'Call /home/api/hello'}
      </button>
    </main>
  )
}
`,
    opts.force
  )

  writeFile(
    join(rootPath, 'src', 'pages', 'home', 'api', 'hello.func.ts'),
    `import { useHttpFunc } from '@faasjs/http'
import { z } from 'zod'

const schema = z
  .object({
    name: z.string().optional(),
  })
  .required()

export const func = useHttpFunc<z.infer<typeof schema>>(() => {
  return async ({ params }) => {
    const parsed = schema.parse(params || {})

    return {
      ok: true,
      data: \`Hello, \${parsed.name || 'FaasJS'}\`,
      error: null,
    }
  }
})
`,
    opts.force
  )

  writeFile(
    join(rootPath, 'src', 'pages', 'home', 'api', '__tests__', 'hello.test.ts'),
    `import { test } from '@faasjs/test'
import { func } from '../hello.func'

describe('home/api/hello', () => {
  it('should work', async () => {
    const testFunc = test(func)

    const { statusCode, data } = await testFunc.JSONhandler({ name: 'world' })

    expect(statusCode).toEqual(200)
    expect(data).toEqual({
      ok: true,
      data: 'Hello, world',
      error: null,
    })
  })
})
`,
    opts.force
  )

  logger.info('Done. Run npm install to install dependencies.')
}

export function InitCommand(program: Command): void {
  program
    .command('init [name]')
    .description(
      'Initialize a FaasJS app in current directory or target folder'
    )
    .option(
      '-f, --force',
      'Initialize even if target directory is not empty',
      false
    )
    .on('--help', () => {
      console.log(
        '\nExamples:\n  npm exec faas init\n  npm exec faas init my-app'
      )
    })
    .action(action)
}
