import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalizeRouteForCompare } from './site-utils.ts'

const ALLOWED_EXTRA_ROUTES = new Set(
  [
    '/doc/dev/functions/runPgliteSql.html',
    '/doc/dev/functions/runPgliteSqlFile.html',
    '/doc/http/functions/useHttpFunc.html',
  ].map(route => normalizeRouteForCompare(route))
)

function normalizeRoutes(routes: string[]): string[] {
  const normalized = new Set<string>()

  for (const route of routes) {
    normalized.add(normalizeRouteForCompare(route))
  }

  return Array.from(normalized).sort((a, b) => {
    if (a === '/') return -1
    if (b === '/') return 1
    return a.localeCompare(b)
  })
}

function readRouteJson(filePath: string): string[] {
  const parsed = JSON.parse(readFileSync(filePath, 'utf8')) as unknown

  if (!Array.isArray(parsed) || parsed.some(item => typeof item !== 'string')) {
    throw new Error(`Invalid route json at ${filePath}`)
  }

  return parsed
}

const scriptPath = fileURLToPath(import.meta.url)
const scriptsDirectory = dirname(scriptPath)
const docsRoot = resolve(scriptsDirectory, '..')
const distRoot = join(docsRoot, 'dist')

const generatedRoutesPath = join(distRoot, 'routes.json')
if (!existsSync(generatedRoutesPath)) {
  throw new Error(
    `Missing generated routes at ${generatedRoutesPath}. Run npm run build first.`
  )
}

const generatedRoutes = normalizeRoutes(readRouteJson(generatedRoutesPath))

const legacySnapshotPath = join(scriptsDirectory, 'legacy-routes.json')

if (!existsSync(legacySnapshotPath)) {
  throw new Error(
    `Missing legacy route snapshot at ${legacySnapshotPath}.`
  )
}

const legacyRoutes = normalizeRoutes(readRouteJson(legacySnapshotPath))

const generatedSet = new Set(generatedRoutes)
const legacySet = new Set(legacyRoutes)

const missingRoutes = legacyRoutes.filter(route => !generatedSet.has(route))
const extraRoutes = generatedRoutes.filter(route => !legacySet.has(route))
const allowedExtraRoutes = extraRoutes.filter(route =>
  ALLOWED_EXTRA_ROUTES.has(normalizeRouteForCompare(route))
)
const unexpectedExtraRoutes = extraRoutes.filter(
  route => !ALLOWED_EXTRA_ROUTES.has(normalizeRouteForCompare(route))
)

if (!missingRoutes.length && !extraRoutes.length) {
  console.log(`Route parity check passed (${generatedRoutes.length} routes).`)
  process.exit(0)
}

if (missingRoutes.length) {
  console.error('Route parity check failed.')
  console.error(`Legacy routes: ${legacyRoutes.length}`)
  console.error(`Generated routes: ${generatedRoutes.length}`)
  console.error(`Missing routes (${missingRoutes.length}):`)
  for (const route of missingRoutes.slice(0, 50)) {
    console.error(`  - ${route}`)
  }

  if (extraRoutes.length) {
    console.error(`Extra routes (${extraRoutes.length}):`)
    for (const route of extraRoutes.slice(0, 50)) {
      console.error(`  + ${route}`)
    }
  }

  process.exit(1)
}

if (unexpectedExtraRoutes.length) {
  console.error('Route parity check failed.')
  console.error(`Legacy routes: ${legacyRoutes.length}`)
  console.error(`Generated routes: ${generatedRoutes.length}`)
  console.error(`Unexpected extra routes (${unexpectedExtraRoutes.length}):`)
  for (const route of unexpectedExtraRoutes.slice(0, 50)) {
    console.error(`  + ${route}`)
  }

  if (allowedExtraRoutes.length) {
    console.error(`Allowed extra routes (${allowedExtraRoutes.length}):`)
    for (const route of allowedExtraRoutes.slice(0, 50)) {
      console.error(`  ~ ${route}`)
    }
  }

  process.exit(1)
}

if (allowedExtraRoutes.length) {
  console.log(
    `Route parity check passed with ${allowedExtraRoutes.length} allowed compatibility route(s).`
  )
  for (const route of allowedExtraRoutes.slice(0, 50)) {
    console.log(`  ~ ${route}`)
  }
  process.exit(0)
}

process.exit(0)
