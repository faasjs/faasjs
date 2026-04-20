import { defineApi, type InvokeData, type Next, type Plugin } from '@faasjs/core'

class SharedPlugin implements Plugin {
  public readonly type = 'shared'
  public readonly name = 'shared'

  public async onInvoke(data: InvokeData, next: Next) {
    data.context.sharedLoaded = true
    await next()
  }
}

const api = defineApi({
  async handler({ config, context }) {
    return {
      http: config.plugins?.http,
      shared: config.plugins?.shared,
      sharedLoaded: context.sharedLoaded,
    }
  },
})

api.plugins.unshift(new SharedPlugin())
api.config = {
  plugins: {
    shared: {
      config: {
        fromCode: true,
      },
      type: 'inline-shared',
    },
  },
}

export default api
