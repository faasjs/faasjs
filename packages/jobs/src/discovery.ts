import { existsSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'

import {
  loadPackage,
  loadPlugins,
  Logger,
  registerNodeModuleHooks,
  type RegisterNodeModuleHooksOptions,
} from '@faasjs/node-utils'

import { isJob, type Job } from './define_job'

export type JobRegistry = Map<string, Job<any, any, any>>

export type LoadJobRegistryOptions = {
  root?: string
  staging?: string
  logger?: Logger
}

export function resolveJobsRoot(root?: string): string {
  if (root) return resolve(root)

  const srcRoot = resolve(process.cwd(), 'src')

  return existsSync(srcRoot) ? srcRoot : process.cwd()
}

function collectJobFiles(root: string): string[] {
  if (!existsSync(root)) return []

  const files: string[] = []

  for (const entry of readdirSync(root)) {
    if (entry === 'node_modules' || entry === 'dist') continue

    const path = resolve(root, entry)
    const stat = statSync(path)

    if (stat.isDirectory()) {
      files.push(...collectJobFiles(path))
      continue
    }

    if (stat.isFile() && path.endsWith('.job.ts')) files.push(path)
  }

  return files.sort()
}

function getModuleHooksOptions(root: string): RegisterNodeModuleHooksOptions {
  const srcRoot = resolve(root)
  const projectTsconfig = join(resolve(srcRoot, '..'), 'tsconfig.json')
  const tsconfigPath = existsSync(projectTsconfig) ? projectTsconfig : undefined
  const options: RegisterNodeModuleHooksOptions = {
    root: tsconfigPath ? dirname(tsconfigPath) : resolve(srcRoot, '..'),
  }

  if (tsconfigPath) options.tsconfigPath = tsconfigPath
  if (process.env.FAASJS_MODULE_VERSION) options.version = process.env.FAASJS_MODULE_VERSION

  return options
}

export function getJobPathFromFile(file: string, root: string): string {
  const relativePath = relative(root, file)

  if (relativePath.startsWith('..') || relativePath === '') {
    throw Error(`[jobs] Job file must be inside root: ${file}`)
  }

  let jobPath = relativePath.split(sep).join('/')

  if (!jobPath.endsWith('.job.ts')) throw Error(`[jobs] Job file must use .job.ts suffix: ${file}`)

  jobPath = jobPath.slice(0, -'.job.ts'.length)

  if (jobPath === 'index') return ''
  if (jobPath.endsWith('/index')) return jobPath.slice(0, -'/index'.length)

  return jobPath
}

export async function loadJobRegistry(options: LoadJobRegistryOptions = {}): Promise<JobRegistry> {
  const root = resolveJobsRoot(options.root)
  const logger = options.logger || new Logger('@faasjs/jobs')
  const staging = options.staging || process.env.FaasEnv || 'development'
  const registry: JobRegistry = new Map()
  const hookOptions = getModuleHooksOptions(root)

  registerNodeModuleHooks(hookOptions)

  for (const file of collectJobFiles(root)) {
    const jobPath = getJobPathFromFile(file, root)
    const loaded = await loadPackage<unknown>(file)

    if (!isJob(loaded)) throw Error(`[jobs] ${file} must default export defineJob(...).`)

    if (registry.has(jobPath)) throw Error(`[jobs] Duplicate job_path "${jobPath}" from ${file}.`)

    loaded.filename = file
    await loadPlugins(loaded, {
      root,
      filename: file,
      staging,
      logger,
    })

    registry.set(jobPath, loaded)
  }

  return registry
}
