import type { InvokeData, Next, Plugin } from '..'

type PluginConfig = {
  name: string
  type: string
}

export class TestsAuthPlugin implements Plugin {
  [key: string]: any
  public readonly name: string
  public readonly type: string

  constructor(config: PluginConfig) {
    this.name = config.name
    this.type = config.type
  }

  public async onInvoke(data: InvokeData, next: Next): Promise<void> {
    data.current_user = {
      id: 1,
      name: 'FaasJS',
    }

    await next()
  }
}
