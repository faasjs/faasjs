#!/usr/bin/env node
import { buildAllDocs, buildApiDocs, prepareDocsSite, syncSkillReferences } from './index.ts'

const [command = 'all', target] = process.argv.slice(2)

switch (command) {
  case 'api':
    buildApiDocs({ packagePath: target })
    break
  case 'skill-references':
    syncSkillReferences()
    break
  case 'prepare-site':
    prepareDocsSite()
    break
  case 'all':
    buildAllDocs()
    break
  default:
    if (command.startsWith('packages/')) {
      buildApiDocs({ packagePath: command })
      break
    }

    throw new Error(
      `Unknown faasjs-docgen command: ${command}. Use all, api [package], skill-references, or prepare-site.`,
    )
}
