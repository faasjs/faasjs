import type { Command } from 'commander'
import { prompt } from 'enquirer'
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { execSync } from 'node:child_process'

const Validator = {
  name(input: string) {
    const match = /^[a-z0-9-_]+$/i.test(input) ? true : 'Must be a-z, 0-9 or -_'
    if (match !== true) return match
    if (existsSync(input))
      return `${input} folder exists, please try another name`

    return true
  },
}

export async function action(
  options: {
    name?: string
    example?: boolean
  } = {}
): Promise<void> {
  const answers: {
    name?: string
    example?: boolean
  } = Object.assign(options, {})

  if (!options.name || Validator.name(options.name) !== true)
    answers.name = await prompt<{ value: string }>({
      type: 'input',
      name: 'value',
      message: 'Project name',
      initial: 'faasjs',
      validate: Validator.name,
    }).then(res => res.value)

  if (typeof answers.example === 'undefined')
    answers.example = await prompt<{ value: boolean }>({
      type: 'confirm',
      name: 'value',
      message: 'Add example files',
      initial: true,
    }).then(res => res.value)

  if (!answers.name) return

  mkdirSync(answers.name)

  const runtime = process.versions.bun ? 'bun' : 'npm'

  writeFileSync(
    join(answers.name, 'faas.yaml'),
    `defaults:
  plugins:
development:
testing:
staging:
production:
`
  )

  writeFileSync(
    join(answers.name, 'package.json'),
    `{
  "name": "${answers.name}",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "serve": "faas server",
    "test": "jest"
  },
  "dependencies": {
    "faasjs": "*"
  },
  "devDependencies": {
    "@faasjs/jest": "*"
  },
  "jest": {
    "transform": {
      ".(jsx|tsx?)": "@faasjs/jest"
    },
    "collectCoverage": true,
    "collectCoverageFrom": [
      "**/*.ts"
    ],
    "testRegex": "/*\\\\.test\\\\.ts$",
    "modulePathIgnorePatterns": [
      "/tmp/",
      "/coverage/"
    ]
  }
}`
  )

  writeFileSync(
    join(answers.name, 'tsconfig.json'),
    `{
  "compilerOptions": {
    "downlevelIteration": true,
    "esModuleInterop": true,
    "target": "ES2019",
    "module": "ESNext",
    "moduleResolution": "node",
    "baseUrl": "."
  }
}
`
  )

  writeFileSync(
    join(answers.name, '.gitignore'),
    `node_modules/
tmp/
coverage/
*.tmp.js
`
  )

  mkdirSync(join(answers.name, '.vscode'))

  writeFileSync(
    join(answers.name, '.vscode', 'settings.json'),
    `{
  "editor.detectIndentation": true,
  "editor.insertSpaces": true,
  "editor.tabSize": 2,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "editor.wordWrap": "on",
  "files.insertFinalNewline": true,
  "files.trimFinalNewlines": true,
  "files.trimTrailingWhitespace": true
}
`
  )

  writeFileSync(
    join(answers.name, '.vscode', 'extensions.json'),
    `{
  "recommendations": [
    "faasjs.faasjs-snippets"
  ]
}
`
  )

  execSync(`cd ${answers.name} && ${runtime} install`, { stdio: 'inherit' })

  if (answers.example) {
    writeFileSync(
      join(answers.name, 'index.func.ts'),
      `import { useFunc } from '@faasjs/func'
import { useHttp } from '@faasjs/http'

export default useFunc(() => {
  const http = useHttp<{ name: string }>()

  return async () => \`Hello, \${http.params.name}\`
})
`
    )

    mkdirSync(join(answers.name, '__tests__'))
    writeFileSync(
      join(answers.name, '__tests__', 'index.test.ts'),
      `import { test } from '@faasjs/test'
import Func from '../index.func'

describe('hello', () => {
  it('should work', async () => {
    const func = test(Func)

    const { statusCode, data } = await func.JSONhandler<string>({ name: 'world' })

    expect(statusCode).toEqual(200)
    expect(data).toEqual('Hello, world')
  })
})
`
    )

    if (runtime === 'bun') {
      execSync(`cd ${answers.name} && bun test`, { stdio: 'inherit' })
    } else execSync(`cd ${answers.name} && npm run test`, { stdio: 'inherit' })
  }
}

export default function (program: Command): void {
  program
    .description('Create a new faas app')
    .on('--help', () => console.log('Examples:\nnpx create-faas-app'))
    .option('--name <name>', 'Project name')
    .action(action)
}
