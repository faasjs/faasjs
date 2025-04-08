import { Func } from '@faasjs/func'

export const func = new Func({
  async handler() {
    return new Response(
      new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder()
          controller.enqueue(encoder.encode('hello'))

          setTimeout(() => {
            controller.error(new Error('error'))
          })
        },
      })
    )
  },
})
