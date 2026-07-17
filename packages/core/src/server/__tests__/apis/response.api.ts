import { Func } from '@faasjs/core'

export default new Func({
  async handler() {
    const headers = new Headers({
      'Content-Type': 'text/custom; charset=utf-8',
      'X-Custom-Header': 'custom-value',
    })
    headers.append('Set-Cookie', 'first=value; Path=/')
    headers.append('Set-Cookie', 'second=value; Path=/')

    return new Response('hello', { headers })
  },
})
