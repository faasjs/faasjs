import { copyFileSync, globSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))
const referencesRoot = join(root, 'skills/faasjs-best-practices/references')
const mirroredPackagesRoot = join(referencesRoot, 'packages')

const files = [
  'packages/README.md',
  'packages/*/README.md',
  'packages/*/classes/**/*.md',
  'packages/*/functions/**/*.md',
  'packages/*/interfaces/**/*.md',
  'packages/*/modules/**/*.md',
  'packages/*/type-aliases/**/*.md',
  'packages/*/variables/**/*.md',
]
  .flatMap((pattern) => globSync(pattern, { cwd: root }))
  .sort((a, b) => a.localeCompare(b))

if (!files.length) {
  throw new Error('No generated API markdown files found. Run `npm run doc` first.')
}

rmSync(mirroredPackagesRoot, { recursive: true, force: true })

for (const file of files) {
  const source = join(root, file)
  const destination = join(referencesRoot, file)

  mkdirSync(dirname(destination), { recursive: true })
  copyFileSync(source, destination)
}

console.log(`Synced ${files.length} markdown files to ${mirroredPackagesRoot}`)
