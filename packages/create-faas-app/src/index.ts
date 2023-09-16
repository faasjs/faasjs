import { Command } from 'commander'
import action from './action'

const commander = new Command()

// 设置命令
commander
  .storeOptionsAsProperties(false)
  .allowUnknownOption(true)
  .version('beta')
  .name('create-faas-app')

// 加载命令
action(commander as Command)

async function main() {
  try {
    if (!process.env.CI && process.argv[0] !== 'fake')
      await commander.parseAsync(process.argv)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export default main()
