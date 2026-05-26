import { existsSync } from 'node:fs'
import { dirname, join, resolve, sep } from 'node:path'

import { normalizeRoot } from './resolver'
import type { LoaderOptions } from './types'

/**
 * Walk up the directory tree from a start path to find the nearest file with the given name.
 *
 * @param {string} startPath - Starting directory or file path.
 * @param {string} filename - File name to search for (e.g., `tsconfig.json`).
 * @returns {string | undefined} Absolute path to the found file, or `undefined` if reached the filesystem root without finding it.
 */
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

/**
 * Walk up the directory tree to find the nearest `tsconfig.json`.
 *
 * @param {string} startPath - Starting directory or file path.
 * @returns {string | undefined} Absolute path to `tsconfig.json`, or `undefined` if not found.
 */
export function findNearestTsconfig(startPath: string): string | undefined {
  return findNearestFile(startPath, 'tsconfig.json')
}

/**
 * Infer loader options (root and tsconfig path) from an arbitrary file.
 *
 * The resolver probes the file's directory and parents for `tsconfig.json`, `package.json`,
 * and `faas.yaml`, choosing the nearest config marker as the project root.
 *
 * @param {string} filePath - Path to a file whose directory is used as the search start.
 * @returns {LoaderOptions} Inferred root and optional tsconfig path.
 */
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
