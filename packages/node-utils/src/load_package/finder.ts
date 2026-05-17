import { existsSync } from 'node:fs'
import { dirname, join, resolve, sep } from 'node:path'

import { normalizeRoot } from './resolver'
import type { LoaderOptions } from './types'

export function findNearestFile(startPath: string, filename: string): string | undefined {
  let current = resolve(startPath)

  while (true) {
    const filePath = join(current, filename)

    if (existsSync(filePath)) return filePath

    const parent = dirname(current)

    if (parent === current) return undefined

    current = parent
  }
}

export function findNearestTsconfig(startPath: string): string | undefined {
  return findNearestFile(startPath, 'tsconfig.json')
}

export function inferLoaderOptionsFromFile(filePath: string): LoaderOptions {
  const fileDir = dirname(filePath)
  const tsconfigPath = findNearestTsconfig(fileDir)

  if (tsconfigPath)
    return {
      root: normalizeRoot(dirname(tsconfigPath)),
      tsconfigPath,
    }

  const packageJsonPath = findNearestFile(fileDir, 'package.json')

  if (packageJsonPath)
    return {
      root: normalizeRoot(dirname(packageJsonPath)),
    }

  const faasYamlPath = findNearestFile(fileDir, 'faas.yaml')

  if (faasYamlPath) {
    const faasYamlDir = dirname(faasYamlPath)

    return {
      root: normalizeRoot(faasYamlDir.endsWith(`${sep}src`) ? dirname(faasYamlDir) : faasYamlDir),
    }
  }

  return {
    root: normalizeRoot(fileDir),
  }
}
