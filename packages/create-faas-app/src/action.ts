import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Command } from 'commander'
import enquirer from 'enquirer'

const prompt = enquirer.prompt
const validateName = (input: string) => Validator.name(input)
const templateRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'template')

const Validator = {
  name(input: string) {
    const match = /^[a-z0-9-_]+$/i.test(input) ? true : 'Must be a-z, 0-9 or -_'
    if (match !== true) return match
    if (existsSync(input)) return `${input} folder exists, please try another name`

    return true
  },
}

function getTemplateNames(): string[] {
  return readdirSync(templateRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

function resolveTemplateName(template = 'basic'): string {
  const templates = getTemplateNames()

  if (templates.includes(template)) return template

  throw new Error(`Unknown template "${template}". Available templates: ${templates.join(', ')}`)
}

function renderTemplate(content: string, replacements: Record<string, string>): string {
  return Object.entries(replacements).reduce(
    (result, [key, value]) => result.replaceAll(`{{${key}}}`, value),
    content,
  )
}

function copyTemplateDirectory(
  sourcePath: string,
  targetPath: string,
  replacements: Record<string, string>,
): void {
  mkdirSync(targetPath, {
    recursive: true,
  })

  for (const entry of readdirSync(sourcePath, { withFileTypes: true })) {
    const nextSourcePath = join(sourcePath, entry.name)
    const nextTargetPath = join(targetPath, entry.name === 'gitignore' ? '.gitignore' : entry.name)

    if (entry.isDirectory()) {
      copyTemplateDirectory(nextSourcePath, nextTargetPath, replacements)
      continue
    }

    writeFileSync(
      nextTargetPath,
      renderTemplate(readFileSync(nextSourcePath, 'utf8'), replacements),
    )
  }
}

function scaffold(
  rootPath: string,
  replacements: Record<string, string>,
  templateName: string,
): void {
  mkdirSync(rootPath)
  copyTemplateDirectory(join(templateRoot, templateName), rootPath, replacements)
}

export async function action(options: { name?: string; template?: string } = {}): Promise<void> {
  const templateName = resolveTemplateName(options.template)
  const answers: {
    name?: string
  } = Object.assign(options, {})

  if (!options.name || Validator.name(options.name) !== true)
    answers.name = await prompt<{ value: string }>({
      type: 'input',
      name: 'value',
      message: 'Project name',
      initial: 'faasjs',
      validate: validateName,
    }).then((res) => res.value)

  if (!answers.name) return

  const runtime = process.versions.bun ? 'bun' : 'npm'

  scaffold(
    answers.name,
    {
      name: answers.name,
    },
    templateName,
  )

  execSync(`cd ${answers.name} && ${runtime} install`, { stdio: 'inherit' })

  if (runtime === 'bun') {
    execSync(`cd ${answers.name} && bun test`, { stdio: 'inherit' })
  } else execSync(`cd ${answers.name} && npm run test`, { stdio: 'inherit' })
}

export default function (program: Command): void {
  program
    .description('Create a new faas app')
    .on('--help', () =>
      console.log(`Examples:
npx create-faas-app --name faasjs
npx create-faas-app --name faasjs-admin --template antd

Templates:
${getTemplateNames().join(', ')}`),
    )
    .option('--name <name>', 'Project name')
    .option('--template <template>', 'Template name', 'basic')
    .action(action)
}
