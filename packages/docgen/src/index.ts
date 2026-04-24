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

export type ManifestPageKind = 'guideline' | 'spec'
export type ManifestLocale = 'en' | 'zh'

export type ManifestPage = {
  kind: ManifestPageKind
  locale: ManifestLocale
  slug: string
  title: string
  summary: string
  sourcePath: string
  outputPath: string
  routePath: string
}

export type DocsManifest = {
  pages: ManifestPage[]
  packages: string[]
}

type BuildApiOptions = DocgenOptions & {
  packagePath?: string
}

const guidelineOrder = [
  'curated-stack',
  'application-slices',
  'project-config',
  'file-conventions',
  'code-comments',
  'define-api',
  'testing',
  'react',
  'react-data-fetching',
  'react-testing',
  'ant-design',
  'node-utils',
  'logger',
  'utils',
  'pg-query-builder',
  'pg-table-types',
  'pg-schema-and-migrations',
  'pg-testing',
]

const specOrder = ['faas-yaml', 'http-protocol', 'plugin', 'routing-mapping']

const pageSummaries: Record<string, string> = {
  plugin:
    'Defines plugin identity, lifecycle execution, config layering, and config-driven loading.',
  'routing-mapping':
    'Standardizes backend route mapping so file paths and request paths stay predictable.',
}

const packageOrder = [
  'core',
  'dev',
  'react',
  'ant-design',
  'node-utils',
  'pg',
  'pg-dev',
  'types',
  'utils',
  'create-faas-app',
  'docgen',
]

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

function routeFromOutputPath(path: string) {
  return `/${path
    .replace(/^docs\//, '')
    .replace(/README\.md$/, '')
    .replace(/\.md$/, '.html')}`
}

function slugFromPath(path: string) {
  return path.split('/').at(-1)?.replace(/\.md$/, '') ?? path
}

function humanizeSlug(slug: string) {
  return slug
    .split('-')
    .map((word) =>
      word.length <= 3 ? word.toUpperCase() : `${word[0]?.toUpperCase()}${word.slice(1)}`,
    )
    .join(' ')
    .replace('PG', 'PG')
    .replace('API', 'API')
}

function extractTitleAndSummary(root: string, sourcePath: string, fallbackTitle: string) {
  const content = readFileSync(join(root, sourcePath), 'utf8')
  const title = content.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? fallbackTitle
  const paragraphs = content.split(/\n{2,}/).map((paragraph) => paragraph.trim())
  const summary =
    paragraphs.find(
      (paragraph) => paragraph && !paragraph.startsWith('#') && !paragraph.includes('\n'),
    ) ?? ''

  return { title, summary }
}

function createPage(
  root: string,
  kind: ManifestPageKind,
  locale: ManifestLocale,
  sourcePath: string,
  outputPath: string,
): ManifestPage {
  const slug = slugFromPath(sourcePath)
  const metadata = extractTitleAndSummary(root, sourcePath, humanizeSlug(slug))
  const summary = pageSummaries[slug] ?? metadata.summary

  return {
    kind,
    locale,
    slug,
    title: metadata.title,
    summary,
    sourcePath,
    outputPath,
    routePath: routeFromOutputPath(outputPath),
  }
}

function sortByOrder<T>(
  items: T[],
  order: string[],
  getSlug = (item: T) => (item as { slug: string }).slug,
) {
  return items.sort((a, b) => {
    const aSlug = getSlug(a)
    const bSlug = getSlug(b)
    const aIndex = order.indexOf(aSlug)
    const bIndex = order.indexOf(bSlug)

    if (aIndex === -1 && bIndex === -1) return aSlug.localeCompare(bSlug)
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    return aIndex - bIndex
  })
}

function createPages(
  root: string,
  kind: ManifestPageKind,
  locale: ManifestLocale,
  sourceGlob: string,
  outputRoot: string,
  order: string[],
) {
  return sortByOrder(
    globSync(sourceGlob, { cwd: root })
      .filter((sourcePath) => !sourcePath.endsWith('/_template.md'))
      .map((sourcePath) =>
        createPage(root, kind, locale, sourcePath, `${outputRoot}/${slugFromPath(sourcePath)}.md`),
      ),
    order,
  )
}

export function buildManifest(options: DocgenOptions = {}): DocsManifest {
  const root = repoRoot(options)
  const enGuidelines = createPages(
    root,
    'guideline',
    'en',
    'skills/faasjs-best-practices/guidelines/*.md',
    'docs/guidelines',
    guidelineOrder,
  )
  const enSpecs = createPages(
    root,
    'spec',
    'en',
    'skills/faasjs-best-practices/references/specs/*.md',
    'docs/specs',
    specOrder,
  )
  const zhGuidelines = createPages(
    root,
    'guideline',
    'zh',
    'skills/faasjs-best-practices/locales/zh/guidelines/*.md',
    'docs/zh/guidelines',
    guidelineOrder,
  )
  const zhSpecs = createPages(
    root,
    'spec',
    'zh',
    'skills/faasjs-best-practices/locales/zh/specs/*.md',
    'docs/zh/specs',
    specOrder,
  )

  return {
    pages: [...enGuidelines, ...enSpecs, ...zhGuidelines, ...zhSpecs],
    packages: sortByOrder(
      globSync('packages/*/package.json', { cwd: root })
        .map(packagePathFromPackageJson)
        .map((path) => path.replace('packages/', '')),
      packageOrder,
      (name) => name,
    ),
  }
}

function rewriteSkillLinksForDocs(content: string, locale: ManifestLocale) {
  const specsPrefix = locale === 'zh' ? '/zh/specs' : '/specs'
  return content
    .replaceAll(
      /\.\.\/references\/packages\/([^/)]+)\/README\.md/g,
      (_match, packageName) => `/doc/${packageName}/`,
    )
    .replaceAll(
      /\.\.\/references\/packages\/([^/)]+)\/([^/)]+)\/([^/)]+)\.md/g,
      (_match, packageName, group, name) => `/doc/${packageName}/${group}/${name}.html`,
    )
    .replaceAll(
      /\.\.\/references\/specs\/([^/)]+)\.md/g,
      (_match, name) => `${specsPrefix}/${name}.html`,
    )
}

function writeGeneratedPage(root: string, page: ManifestPage) {
  const outputPath = join(root, page.outputPath)
  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(
    outputPath,
    rewriteSkillLinksForDocs(readFileSync(join(root, page.sourcePath), 'utf8'), page.locale),
  )
}

function renderPackageName(name: string) {
  return name === 'create-faas-app' ? name : `@faasjs/${name}`
}

function renderGuideIndex(manifest: DocsManifest) {
  const guidelines = manifest.pages.filter(
    (page) => page.kind === 'guideline' && page.locale === 'en',
  )
  const specs = manifest.pages.filter((page) => page.kind === 'spec' && page.locale === 'en')
  const mainPathSlugs = [
    'curated-stack',
    'project-config',
    'file-conventions',
    'define-api',
    'react-data-fetching',
    'ant-design',
    'pg-query-builder',
    'pg-schema-and-migrations',
    'pg-testing',
    'plugin',
    'application-slices',
  ]
  const mainPath = mainPathSlugs
    .map((slug) => [...guidelines, ...specs].find((page) => page.slug === slug))
    .filter((page): page is ManifestPage => Boolean(page))
  const numberedMainPath = mainPath
    .map((page, index) => `${index + 1}. [${page.title}](${page.routePath})`)
    .join('\n')
  const guidelineList = guidelines
    .map((page) => `- [${page.title}](${page.routePath}): ${page.summary}`)
    .join('\n')
  const specList = specs
    .map((page) => `- [${page.title}](${page.routePath}): ${page.summary}`)
    .join('\n')
  const packageList = manifest.packages
    .map((name) => `- [${renderPackageName(name)}](/doc/${name}/)`)
    .join('\n')

  return `# Best Practices

Use these guides and specifications as the current public guidance for building with FaasJS.

FaasJS is a Rails-inspired, curated full-stack TypeScript framework for database-driven React business applications. The main path is React, Ant Design, typed APIs, PostgreSQL, validation, testing, plugins, and stable project conventions.

## Main Path

Read these guides in order when starting a new feature or asking an AI coding agent to build one:

${numberedMainPath}

FaasJS favors complete application slices over generator-heavy workflows. A slice should keep UI, API, validation, database changes, and tests easy to find, review, and modify together.

## Guidelines

${guidelineList}

## Specifications

${specList}

## API Docs

${packageList}
`
}

function writeGeneratedGuideIndex(root: string, manifest: DocsManifest) {
  writeFileSync(join(root, 'docs/guide/README.md'), renderGuideIndex(manifest))
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
  const manifest = buildManifest({ root })

  rmSync(join(docsRoot, 'guidelines'), { recursive: true, force: true })
  rmSync(join(docsRoot, 'specs'), { recursive: true, force: true })
  rmSync(join(docsRoot, 'zh/guidelines'), { recursive: true, force: true })
  rmSync(join(docsRoot, 'zh/specs'), { recursive: true, force: true })

  for (const page of manifest.pages) writeGeneratedPage(root, page)
  writeGeneratedGuideIndex(root, manifest)

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
