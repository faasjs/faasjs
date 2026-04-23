import { execSync } from 'node:child_process'
import {
  copyFileSync,
  existsSync,
  globSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join } from 'node:path'

export type DocgenOptions = {
  root?: string
}

type BuildApiOptions = DocgenOptions & {
  packagePath?: string
}

function repoRoot(options: DocgenOptions = {}) {
  if (options.root) return options.root

  let directory = process.cwd()

  while (directory !== dirname(directory)) {
    if (existsSync(join(directory, 'packages')) && existsSync(join(directory, 'package.json'))) {
      return directory
    }

    directory = dirname(directory)
  }

  return process.cwd()
}

function run(cmd: string, cwd: string) {
  console.log(cmd)
  execSync(cmd, { cwd, stdio: 'inherit' })
}

function normalizePath(path: string) {
  return path.replaceAll('\\', '/')
}

function packagePathFromPackageJson(path: string) {
  return normalizePath(path).replace('/package.json', '')
}

export function buildApiDocs(options: BuildApiOptions = {}) {
  const root = repoRoot(options)
  const packageJsons = options.packagePath
    ? [`${options.packagePath.replace(/\/$/, '')}/package.json`]
    : globSync('packages/*/package.json', { cwd: root }).filter(
        (path: string) =>
          !['packages/cli/package.json', 'packages/create-faas-app/package.json'].includes(path),
      )

  for (const path of packageJsons) {
    console.log(path)
    const pkg = JSON.parse(readFileSync(join(root, path), 'utf8'))

    if (!pkg.types) continue

    const packagePath = packagePathFromPackageJson(path)

    rmSync(join(root, packagePath, 'classes'), { recursive: true, force: true })
    rmSync(join(root, packagePath, 'functions'), { recursive: true, force: true })
    rmSync(join(root, packagePath, 'interfaces'), { recursive: true, force: true })
    rmSync(join(root, packagePath, 'type-aliases'), { recursive: true, force: true })
    rmSync(join(root, packagePath, 'modules'), { recursive: true, force: true })
    rmSync(join(root, packagePath, 'variables'), { recursive: true, force: true })

    const intentionallyNotExportedArgs =
      packagePath === 'packages/types' ? ' --intentionallyNotExported FaasActions' : ''

    run(
      `vp exec typedoc ${packagePath}/src/index.ts --tsconfig ${packagePath}/tsconfig.json --out ${packagePath}/${intentionallyNotExportedArgs}`,
      root,
    )

    const files = globSync(`${packagePath}/**/*.md`, { cwd: root })

    for (const file of files) {
      const absoluteFile = join(root, file)
      const content = readFileSync(absoluteFile, 'utf8')
      if (content.includes('***')) writeFileSync(absoluteFile, content.replaceAll('\n***\n', ''))
    }
  }
}

export function syncSkillReferences(options: DocgenOptions = {}) {
  const root = repoRoot(options)
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
}

export function prepareDocsSite(options: DocgenOptions = {}) {
  const root = repoRoot(options)
  const docsRoot = join(root, 'docs')

  rmSync(join(docsRoot, 'doc'), { recursive: true, force: true })
  mkdirSync(join(docsRoot, 'doc'), { recursive: true })
  writeFileSync(join(docsRoot, 'doc/.keep'), '')

  const packages = globSync('packages/**/*.md', { cwd: root })

  for (const file of packages) {
    const target = join(docsRoot, file.replace('packages/', 'doc/'))
    mkdirSync(dirname(target), { recursive: true })
    copyFileSync(join(root, file), target)
  }

  writeFileSync(
    join(docsRoot, 'doc/README.md'),
    readFileSync(join(root, 'packages/README.md'), 'utf8').replaceAll(
      /https:\/\/github.com\/faasjs\/faasjs\/tree\/main\/packages\/([^)]+)/g,
      (_, name) => `/doc/${name}/`,
    ),
  )

  const files = globSync('doc/**/*.md', { cwd: docsRoot })

  for (const file of files) {
    if (file === 'doc/README.md') continue

    const absoluteFile = join(docsRoot, file)
    let content = readFileSync(absoluteFile, 'utf8')
    console.log(file)
    if (content.startsWith('# ')) {
      const title = content.split('\n')[0].replace('# ', '')
      content = `[Documents](../) / ${title}\n\n${content}`
    } else {
      content = `[Documents](../) / ${content}`
    }
    writeFileSync(absoluteFile, content)
  }

  const images = globSync('images/**/*.md', { cwd: root })

  for (const file of images) {
    const target = join(docsRoot, file.replace('images/', 'doc/images/'))
    mkdirSync(dirname(target), { recursive: true })
    copyFileSync(join(root, file), target)

    if (file === 'images/README.md') continue

    const content = readFileSync(target, 'utf8')
    writeFileSync(target, `[Images](../) / faasjs/${target.split('/').at(-2)}\n\n${content}`)
  }

  writeFileSync(
    join(docsRoot, 'doc/images/README.md'),
    readFileSync(join(docsRoot, 'doc/images/README.md'), 'utf8').replaceAll(
      'https://faasjs.com',
      '',
    ),
  )

  const roots = globSync('*.md', { cwd: root })

  for (const file of roots) {
    if (file === 'README.md') continue
    copyFileSync(join(root, file), join(docsRoot, file))
  }
}

export function buildAllDocs(options: DocgenOptions = {}) {
  const root = repoRoot(options)

  buildApiDocs({ root })
  syncSkillReferences({ root })
  run('vp check --fix', root)
}
