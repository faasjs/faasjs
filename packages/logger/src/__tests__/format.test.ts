import { describe, expect, it, vi } from "vitest"
import { formatLogger } from "../logger"

const { mockedFormat } = vi.hoisted(() => {
  return { mockedFormat: vi.fn() }
})

describe('formatLogger', () => {
  vi.mock('node:util', () => ({
    format: mockedFormat,
  }))

  it('should format simple objects correctly', () => {
    mockedFormat.mockReturnValue('formatted')

    expect(formatLogger()).toEqual('formatted')
  })

  it('should handle broken objects', () => {
    mockedFormat.mockImplementation(() => { throw Error('error') })

    expect(formatLogger()).toEqual('[Unable to format]')
  })
})
