import { defineApi, type InvokeData, type Next, type Plugin } from '@faasjs/core'

class SharedPlugin implements Plugin {
  public readonly type = 'shared'
  public readonly name = 'shared'

  public async onInvoke(data: InvokeData, next: Next) {
    data.context.sharedLoaded = true
    await next()
  }
}

export const func = defineApi({
  async handler({ config, context }) {
    return {
      http: config.plugins?.http,
      shared: config.plugins?.shared,
      sharedLoaded: context.sharedLoaded,
    }
  },
})

func.plugins.unshift(new SharedPlugin())
func.config = {
  plugins: {
    shared: {
      config: {
        fromCode: true,
      },
      type: 'inline-shared',
    },
  },
}
