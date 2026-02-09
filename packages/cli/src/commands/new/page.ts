import { join } from 'node:path'
import type { Command } from 'commander'
import {
  ensureDirectory,
  getPagesPath,
  normalizePath,
  writeFile,
} from './utils'

export function action(name: string): void {
  const pagesPath = getPagesPath()
  ensureDirectory(pagesPath)

  const normalized = normalizePath(name)
  const pageDir = join(pagesPath, ...normalized.split('/'))

  writeFile(
    join(pageDir, 'index.tsx'),
    `export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>${normalized}</h1>
    </main>
  )
}
`
  )
}

export function NewPageCommand(program: Command): void {
  program
    .command('page <name>')
    .description('Generate page component in src/pages/**/index.tsx')
    .action(action)
}
