import { action } from '../commands/server'
import { getAll, closeAll } from '@faasjs/server'

describe('server', () => {
  afterAll(() => {
    closeAll()
  })

  it('should work', async () => {
    const port = 4001 + Math.floor(Math.random() * 10)
    action({ port })

    const servers = getAll()

    expect(servers.length).toEqual(1)
    expect(servers[0].opts.port).toEqual(port)
  })
})
