import type { InvokeData, Next, Plugin } from '../..'

export class FileUrlPlugin implements Plugin {
  [key: string]: any
  public readonly name: string
  public readonly type: string

  constructor(config: { name: string; type: string }) {
    this.name = config.name
    this.type = config.type
  }

  public async onInvoke(data: InvokeData, next: Next): Promise<void> {
    const context = data.context as Record<string, any>
    context.fileUrlFixturePluginLoaded = true

    await next()
  }
}
