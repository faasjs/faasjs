import { Command } from 'commander';
import action from './action';

const commander = new Command();

// 设置命令
commander
  .storeOptionsAsProperties(false)
  .version('beta')
  .name('create-faas-app');

// 加载命令
action(commander as Command);

if (!process.env.CI && process.argv[0] !== 'fake') commander.parse(process.argv); 

export default commander;
