import { existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { execs, promptMock } = vi.hoisted(() => ({
  execs: [] as string[],
  promptMock: vi.fn(),
}))

vi.mock('node:child_process', () => ({
  execSync(command: string) {
    execs.push(command)
  },
}))

vi.mock('enquirer', () => ({
  default: {
    prompt: promptMock,
  },
}))

import { action } from '../../action'

describe('action coverage', () => {
  let currentDir = ''
  let tempDir = ''

  beforeEach(() => {
    execs.length = 0
    promptMock.mockReset()
    currentDir = process.cwd()
    tempDir = mkdtempSync(join(tmpdir(), 'create-faas-app-coverage-'))
    process.chdir(tempDir)
  })

  afterEach(() => {
    process.chdir(currentDir)
    rmSync(tempDir, {
      recursive: true,
      force: true,
    })
  })

  it('should prompt when the provided name is invalid', async () => {
    promptMock.mockResolvedValue({ value: 'prompted-app' })

    await action({
      name: 'bad name',
    })

    expect(promptMock).toHaveBeenCalledTimes(1)
    expect(existsSync(join(tempDir, 'prompted-app'))).toBe(true)
    expect(execs).toEqual(['cd prompted-app && npm install', 'cd prompted-app && npm run test'])
  })

  it('should prompt again when the target folder already exists', async () => {
    mkdirSync(join(tempDir, 'taken'))
    promptMock.mockResolvedValue({ value: 'fresh-app' })

    await action({
      name: 'taken',
    })

    expect(promptMock).toHaveBeenCalledTimes(1)
    expect(existsSync(join(tempDir, 'fresh-app'))).toBe(true)
  })

  it('should stop when the prompt returns no name', async () => {
    promptMock.mockResolvedValue({ value: undefined })

    await action({
      name: 'invalid name',
    })

    expect(promptMock).toHaveBeenCalledTimes(1)
    expect(execs).toEqual([])
    expect(existsSync(join(tempDir, 'faasjs'))).toBe(false)
  })
})
