import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { Command } from 'commander'
import enquirer from 'enquirer'

const prompt = enquirer.prompt

const Validator = {
  name(input: string) {
    const match = /^[a-z0-9-_]+$/i.test(input) ? true : 'Must be a-z, 0-9 or -_'
    if (match !== true) return match
    if (existsSync(input)) return `${input} folder exists, please try another name`

    return true
  },
}

function writeFile(path: string, content: string): void {
  mkdirSync(dirname(path), {
    recursive: true,
  })
  writeFileSync(path, content)
}

function buildPackageJSON(name: string): string {
  return `${JSON.stringify(
    {
      name,
      private: true,
      type: 'module',
      version: '1.0.0',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        start: 'node server.ts',
        check: 'faas lint',
        test: 'vitest run',
        'migrate:latest': 'faas knex latest',
        'migrate:rollback': 'faas knex rollback',
        'migrate:status': 'faas knex status',
        'migrate:current': 'faas knex current',
        'migrate:make': 'faas knex make',
      },
      dependencies: {
        '@faasjs/core': '*',
        pg: '*',
        react: '*',
        'react-dom': '*',
      },
      devDependencies: {
        '@electric-sql/pglite': '*',
        '@faasjs/dev': '*',
        '@types/node': '*',
        '@types/react': '*',
        '@types/react-dom': '*',
        '@vitejs/plugin-react': '*',
        jsdom: '*',
        'knex-pglite': '*',
        oxfmt: '*',
        oxlint: '*',
        typescript: '*',
        vite: '*',
        vitest: '*',
      },
    },
    null,
    2,
  )}
`
}

function scaffold(rootPath: string): void {
  writeFile(
    join(rootPath, '.gitignore'),
    `node_modules/
dist/
coverage/
.pglite_dev/
`,
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
  )

  writeFile(
    join(rootPath, 'vite.config.ts'),
    `import { viteFaasJsServer } from '@faasjs/dev'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  plugins: [react(), viteFaasJsServer()],
})
`,
  )

  writeFile(
    join(rootPath, 'server.ts'),
    `import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Server, staticHandler } from '@faasjs/core'

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
  )

  writeFile(
    join(rootPath, 'src', 'faas.yaml'),
    `defaults:
  server:
    root: .
    base: /
  plugins:
    http:
      config:
        cookie:
          secure: false
          session:
            secret: secret
    knex:
      config:
        client: pg
        pool:
          min: 0
          max: 10
        migrations:
          directory: ./src/db/migrations
          extension: ts
development:
  plugins:
    knex:
      config:
        client: pglite
        connection: ./.pglite_dev
testing:
  plugins:
    knex:
      config:
        client: pglite
production:
  plugins:
    knex:
      config:
        client: pg
`,
  )

  writeFile(join(rootPath, 'src', 'db', 'migrations', '.gitkeep'), '')

  writeFile(
    join(rootPath, 'src', 'main.tsx'),
    `import { createRoot } from 'react-dom/client'
import HomePage from './pages/home'

createRoot(document.getElementById('root') as HTMLElement).render(<HomePage />)
`,
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
  )

  writeFile(
    join(rootPath, 'src', 'pages', 'home', 'api', 'hello.func.ts'),
    `import { defineApi, z } from '@faasjs/core'

const schema = z
  .object({
    name: z.string().optional(),
  })
  .required()

export const func = defineApi({
  schema,
  async handler({ params }) {
    return {
      ok: true,
      data: \`Hello, \${params.name || 'FaasJS'}\`,
      error: null,
    }
  },
})
`,
  )

  writeFile(
    join(rootPath, 'src', 'pages', 'home', 'api', '__tests__', 'hello.test.ts'),
    `import { test } from '@faasjs/dev'
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
  )
}

export async function action(options: { name?: string } = {}): Promise<void> {
  const answers: {
    name?: string
  } = Object.assign(options, {})

  if (!options.name || Validator.name(options.name) !== true)
    answers.name = await prompt<{ value: string }>({
      type: 'input',
      name: 'value',
      message: 'Project name',
      initial: 'faasjs',
      validate: Validator.name,
    }).then((res) => res.value)

  if (!answers.name) return

  const runtime = process.versions.bun ? 'bun' : 'npm'

  mkdirSync(answers.name)

  writeFileSync(join(answers.name, 'package.json'), buildPackageJSON(answers.name))

  scaffold(answers.name)

  execSync(`cd ${answers.name} && ${runtime} install`, { stdio: 'inherit' })

  if (runtime === 'bun') {
    execSync(`cd ${answers.name} && bun test`, { stdio: 'inherit' })
  } else execSync(`cd ${answers.name} && npm run test`, { stdio: 'inherit' })
}

export default function (program: Command): void {
  program
    .description('Create a new faas app')
    .on('--help', () => console.log('Examples:\nnpx create-faas-app'))
    .option('--name <name>', 'Project name')
    .action(action)
}
