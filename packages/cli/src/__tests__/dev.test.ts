import { describe, it } from 'vitest'
import { action } from '../commands/dev'

describe('server', () => {
  it('should work', async () => {
    const port = 4001 + Math.floor(Math.random() * 10)

    action({ port })
  })
})
