import { Logger } from '@faasjs/logger'
import type { Command } from 'commander'
import { getRootPath, runCommand } from '../helper'

const logger = new Logger('Cli:check')

export function action(opts: {
  lint?: boolean
  type?: boolean
  test?: boolean
}): void {
  const rootPath = getRootPath()

  const jobs: [boolean | undefined, string, string][] = [
    [opts.lint, 'lint', 'npm exec biome check .'],
    [opts.type, 'type', 'npm exec tsc --noEmit'],
    [opts.test, 'test', 'npm exec vitest run'],
  ]

  const enabledJobs = jobs.filter(item => item[0] !== false)

  if (!enabledJobs.length)
    throw Error('At least one check step must be enabled')

  for (const [, label, command] of enabledJobs) {
    logger.info('Running %s check...', label)
    runCommand(command, rootPath)
  }
}

export function CheckCommand(program: Command): void {
  program
    .command('check')
    .description('Run lint, type and test checks')
    .option('--no-lint', 'Skip lint checks')
    .option('--no-type', 'Skip type checks')
    .option('--no-test', 'Skip test checks')
    .on('--help', () => {
      console.log(
        '\nExamples:\n  npm exec faas check\n  npm exec faas check -- --no-test'
      )
    })
    .action(action)
}
