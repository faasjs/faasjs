import { Func } from '@faasjs/func'
import { Http } from '@faasjs/http'

export const func = new Func({
  plugins: [new Http()],
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
