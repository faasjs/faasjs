import { Func } from '@faasjs/core'
import { Http } from '@faasjs/core'

/**
 * Fixture HTTP function used by testing helpers to verify route loading.
 */
export const func = new Func({
  plugins: [new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })],
  async handler({ event }) {
    return {
      path: event.path,
    }
  },
})
