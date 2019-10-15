import { Command } from 'commander';
import Logger from '@faasjs/logger';
import newFunc from './new/func';

export function action (type: string, name: string, plguins: string[]) {
  const logger = new Logger();

  switch (type) {
    case 'func':
      newFunc(logger, name, plguins);
      break;
    default:
      logger.error(`Unknown type: ${type} (should be func)`);
      break;
  }
}

export default function (program: Command) {
  program
    .command('new <type> <name> [plguins...]')
    .name('new')
    .description('新建文件')
    .on('--help', function () {
      console.log(`
Examples:
  yarn new func hello
  yarn new func folder/demo cf http sql redis`);
    })
    .action(action);
}
