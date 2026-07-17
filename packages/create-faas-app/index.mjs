#!/usr/bin/env node

import { realpathSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

export async function runCli(argv = process.argv, mainFunction) {
  try {
    const run = mainFunction ?? (await import('./dist/index.mjs')).main

    await run(argv)
  } catch (error) {
    console.error(error)
    process.exitCode = 1
  }
}

function isEntrypoint() {
  if (!process.argv[1]) return false

  try {
    return import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href
  } catch {
    return false
  }
}

if (isEntrypoint()) await runCli()
