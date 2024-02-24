import { Command } from 'commander'
import action from './action'

const commander = new Command()

commander
  .storeOptionsAsProperties(false)
  .allowUnknownOption(true)
  .name('create-faas-app')

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
