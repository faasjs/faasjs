import { defineApi } from '../..'

export default defineApi({
  async handler(data) {
    return {
      loaded: Boolean((data.context as Record<string, any>).fileUrlFixturePluginLoaded),
    }
  },
})
