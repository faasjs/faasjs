import { Command } from 'commander'
import newFunc from './new/func'

export function action (type: string, name: string, plguins: string[]): void {
  switch (type) {
    case 'func':
      newFunc(name, plguins)
      break
    default:
      throw Error(`Unknown type: ${type} (only support func now)`)
  }
}

export default function (program: Command): void {
  program
    .command('new <type> <name> [plguins...]')
    .name('new')
    .description('新建文件')
    .on('--help', function () {
      console.log(`
Examples:
  yarn new func hello
  yarn new func folder/demo cf http sql redis`)
    })
    .action(action)
}
