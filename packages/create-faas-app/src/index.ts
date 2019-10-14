import { Command } from 'commander';
import action from './action';

const commander: Command = new Command();

// 设置命令
commander
  .version('beta');

// 加载命令
action(commander);

if (!process.env.CI && process.argv[0] !== 'fake') {
  commander.parse(process.argv);
}

export default commander;
