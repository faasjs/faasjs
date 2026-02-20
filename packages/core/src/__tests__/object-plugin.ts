import type { InvokeData, Next, Plugin } from '..'

type PluginConfig = {
  name: string
  type: string
}

class TestsObjectPlugin implements Plugin {
  [key: string]: any
  public readonly name: string
  public readonly type: string

  constructor(config: PluginConfig) {
    this.name = config.name
    this.type = config.type
  }

  public async onInvoke(data: InvokeData, next: Next): Promise<void> {
    const context = data.context as Record<string, any>
    context.objectPluginLoaded = true
    await next()
  }
}

export default {
  TestsObjectPlugin,
}
