import { Command } from 'commander'
import newFunc from './new/func'

export function action(type: string, name: string, plugins: string[]): void {
  switch (type) {
    case 'func':
      newFunc(name, plugins)
      break
    default:
      throw Error(`Unknown type: ${type} (only support func now)`)
  }
}

export function NewCommand(program: Command): void {
  program
    .command('new <type> <name> [plugins...]')
    .name('new')
    .description('Generate new file')
    .on('--help', () => {
      console.log(`
Examples:
  npm exec faas new func hello
  npm exec faas new func folder/demo cf http sql redis`)
    })
    .action(action)
}
