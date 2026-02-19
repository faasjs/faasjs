import { Func } from '@faasjs/func'
import { Http } from '@faasjs/core'

export const func = new Func({
  plugins: [new Http()],
  async handler() {
    return new ReadableStream({
      start(controller) {
        controller.error(new Error('Stream error'))
      },
    })
  },
})
