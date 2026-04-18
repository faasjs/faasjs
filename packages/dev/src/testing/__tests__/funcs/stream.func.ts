import { Func } from '@faasjs/core'
import { Http } from '@faasjs/core'

export const func = new Func({
  plugins: [new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })],
  async handler() {
    const encoder = new TextEncoder()

    return new ReadableStream({
      start(controller) {
        for (const chunk of ['Hello', ' ', 'World', '!']) {
          controller.enqueue(encoder.encode(chunk))
        }
        controller.close()
      },
    })
  },
})
