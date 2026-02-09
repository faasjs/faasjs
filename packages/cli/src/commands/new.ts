import type { Command } from 'commander'
import { NewApiCommand } from './new/api'
import { NewFeatureCommand } from './new/feature'
import { NewPageCommand } from './new/page'

export function NewCommand(program: Command): void {
  const command = program.command('new').description('Generate project files')

  NewPageCommand(command)
  NewApiCommand(command)
  NewFeatureCommand(command)
}
