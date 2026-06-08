/**
 * # @faasjs/docgen
 *
 * Documentation generation utilities for the FaasJS monorepo.
 *
 * The generator builds package API Markdown from source JSDoc, mirrors public
 * best-practices guides from `skills/faasjs-best-practices/**`, prepares the
 * docs site content under `docs/**`, and exposes the manifest used by the docs
 * navigation.
 *
 * @packageDocumentation
 */

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

/**
 * Options shared by docgen entrypoints.
 */
export type DocgenOptions = {
  /** Repository root. Defaults to auto-detecting the nearest directory with `packages/` and `package.json` from `process.cwd()`. */
  root?: string
}

/** Kind of page represented in the docs manifest. Current manifest generation emits guideline pages. */
export type ManifestPageKind = 'guideline' | 'spec'

/** Locale identifier for generated docs pages. */
export type ManifestLocale = 'en'

/**
 * Manifest record for one source Markdown page.
 */
export type ManifestPage = {
  /** Page category. */
  kind: ManifestPageKind
  /** Page locale. */
  locale: ManifestLocale
  /** URL-friendly slug derived from the source filename. */
  slug: string
  /** Page title, usually read from the first Markdown heading. */
  title: string
  /** Short summary read from the page body or configured override. */
  summary: string
  /** Source Markdown path relative to the repository root. */
  sourcePath: string
  /** Generated Markdown path relative to the repository root. */
  outputPath: string
  /** Docs-site route derived from the generated output path. */
  routePath: string
  /** Raw source Markdown content. */
  sourceContent: string
}

/**
 * Docs site manifest generated from source guides and package metadata.
 */
export type DocsManifest = {
  /** Source pages included in the generated docs site. */
  pages: ManifestPage[]
  /** Sorted package slugs included in the API docs index; `docgen` is intentionally excluded. */
  packages: string[]
}

const guidelineOrder = [
  'curated-stack',
  'application-slices',
  'project-config',
  'file-conventions',
  'code-comments',
  'define-api',
  'jobs',
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

const pageSummaries: Record<string, string> = {}

const packageOrder = [
  'core',
  'dev',
  'react',
  'ant-design',
  'node-utils',
  'jobs',
  'pg',
  'pg-dev',
  'types',
  'utils',
  'create-faas-app',
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

function createPage(
  root: string,
  kind: ManifestPageKind,
  locale: ManifestLocale,
  sourcePath: string,
  outputPath: string,
): ManifestPage {
  const slug = slugFromPath(sourcePath)
  const content = readFileSync(join(root, sourcePath), 'utf8')
  const title = content.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? humanizeSlug(slug)
  const paragraphs = content.split(/\n{2,}/).map((paragraph) => paragraph.trim())
  const summary =
    paragraphs.find(
      (paragraph) => paragraph && !paragraph.startsWith('#') && !paragraph.includes('\n'),
    ) ?? ''
  const pageSummary = pageSummaries[slug] ?? summary

  return {
    kind,
    locale,
    slug,
    title,
    summary: pageSummary,
    sourcePath,
    outputPath,
    routePath: routeFromOutputPath(outputPath),
    sourceContent: content,
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

/**
 * Build the docs manifest without writing generated files.
 *
 * @param {DocgenOptions} [options] - Repository root override.
 * @returns {DocsManifest} Manifest with guideline pages and package slugs.
 */
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

  return {
    pages: enGuidelines,
    packages: sortByOrder(
      globSync('packages/*/package.json', { cwd: root })
        .map(packagePathFromPackageJson)
        .map((path) => path.replace('packages/', ''))
        .filter((name) => name !== 'docgen'),
      packageOrder,
      (name) => name,
    ),
  }
}

function rewriteSkillLinksForDocs(content: string) {
  return content
    .replaceAll(
      /\.\.\/references\/packages\/([^/)]+)\/README\.md/g,
      (_match, packageName) => `/doc/${packageName}/`,
    )
    .replaceAll(
      /\.\.\/references\/packages\/([^/)]+)\/([^/)]+)\/([^/)]+)\.md/g,
      (_match, packageName, group, name) => `/doc/${packageName}/${group}/${name}.html`,
    )
}

function writeGeneratedPage(root: string, page: ManifestPage) {
  const outputPath = join(root, page.outputPath)
  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, rewriteSkillLinksForDocs(page.sourceContent))
}

function renderPackageName(name: string) {
  return name === 'create-faas-app' ? name : `@faasjs/${name}`
}

function renderGuideIndex(manifest: DocsManifest) {
  const guidelines = manifest.pages.filter(
    (page) => page.kind === 'guideline' && page.locale === 'en',
  )
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
    'application-slices',
  ]
  const mainPath = mainPathSlugs
    .map((slug) => guidelines.find((page) => page.slug === slug))
    .filter((page): page is ManifestPage => Boolean(page))
  const numberedMainPath = mainPath
    .map((page, index) => `${index + 1}. [${page.title}](${page.routePath})`)
    .join('\n')
  const guidelineList = guidelines
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

## API Docs

${packageList}
`
}

function writeGeneratedGuideIndex(root: string, manifest: DocsManifest) {
  writeFileSync(join(root, 'docs/guidelines/README.md'), renderGuideIndex(manifest))
}

/**
 * Generate package API Markdown from source JSDoc using TypeDoc.
 *
 * By default this regenerates API docs for packages with a `types` entry, excluding
 * `create-faas-app` and `docgen`. Pass `packagePath` to target one package. Existing
 * generated API folders are removed before TypeDoc runs.
 *
 * @param {BuildApiOptions} [options] - Repository root and optional target package path.
 * @throws {Error} When TypeDoc or filesystem operations fail.
 */
export function buildApiDocs(options: DocgenOptions & { packagePath?: string } = {}) {
  const root = repoRoot(options)
  const packageJsons = options.packagePath
    ? [`${options.packagePath.replace(/\/$/, '')}/package.json`]
    : globSync('packages/*/package.json', { cwd: root }).filter(
        (path: string) =>
          !['packages/create-faas-app/package.json', 'packages/docgen/package.json'].includes(path),
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

/**
 * Prepare generated docs-site Markdown from source guides and package API docs.
 *
 * This rewrites generated content under `docs/guidelines`, `docs/zh`, and `docs/doc`,
 * copies package Markdown except `packages/docgen/**`, and refreshes guide indexes.
 *
 * @param {DocgenOptions} [options] - Repository root override.
 */
export function prepareDocsSite(options: DocgenOptions = {}) {
  const root = repoRoot(options)
  const docsRoot = join(root, 'docs')
  const manifest = buildManifest({ root })

  rmSync(join(docsRoot, 'guidelines'), { recursive: true, force: true })
  rmSync(join(docsRoot, 'zh'), { recursive: true, force: true })

  for (const page of manifest.pages) writeGeneratedPage(root, page)
  writeGeneratedGuideIndex(root, manifest)

  rmSync(join(docsRoot, 'doc'), { recursive: true, force: true })
  mkdirSync(join(docsRoot, 'doc'), { recursive: true })
  writeFileSync(join(docsRoot, 'doc/.keep'), '')

  const packages = globSync('packages/**/*.md', { cwd: root }).filter(
    (file) => !file.startsWith('packages/docgen/'),
  )

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

/**
 * Run the full docs sync workflow for the repository.
 *
 * The workflow runs package API generation, prepares the docs site content, then runs
 * `vp check --fix`, which may format generated and source files.
 *
 * @param {DocgenOptions} [options] - Repository root override.
 */
export function buildAllDocs(options: DocgenOptions = {}) {
  const root = repoRoot(options)

  buildApiDocs({ root })
  prepareDocsSite({ root })
  run('vp check --fix', root)
}
