import { Func } from '@faasjs/core'
import { Http } from '@faasjs/core'

let active = 0
let maxActive = 0
const http = new Http()

export const func = new Func({
  plugins: [http],
  async handler() {
    active++
    maxActive = Math.max(maxActive, active)

    try {
      await new Promise((resolve) => setTimeout(resolve, 80))

      return {
        maxActive,
      }
    } finally {
      active--
    }
  },
})
