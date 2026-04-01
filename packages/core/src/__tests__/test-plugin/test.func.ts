import { defineApi } from '../..'

export const func = defineApi({
  async handler(data) {
    return {
      loaded: Boolean((data.context as Record<string, any>).fileUrlFixturePluginLoaded),
    }
  },
})
