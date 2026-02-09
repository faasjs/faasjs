import type { Command } from 'commander'
import { getRootPath, runCommand } from '../helper'

export function action(): void {
  runCommand('npm exec vite build', getRootPath())
}

export function BuildCommand(program: Command): void {
  program
    .command('build')
    .description('Build frontend assets with Vite')
    .on('--help', () => {
      console.log('\nExamples:\n  npm exec faas build')
    })
    .action(action)
}
