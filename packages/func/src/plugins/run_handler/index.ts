import type { InvokeData, Plugin } from '../../index'

const Name = 'handler'

export class RunHandler implements Plugin {
  public readonly type = Name
  public readonly name = Name

  public async onInvoke(
    data: InvokeData,
    next: () => Promise<void>
  ): Promise<void> {
    if (data.handler)
      if (!data.runHandler) {
        try {
          data.response = await new Promise((resolve, reject) => {
            data.callback = (error: Error, result: any): void => {
              if (error) reject(error)
              else resolve(result)
            }
            Promise.resolve(data.handler?.(data)).then(resolve).catch(reject)
          })
        } catch (error: any) {
          data.logger.error(error)
          data.response = error
        }
        data.runHandler = true
      } else data.logger.warn('handler has been run')

    await next()
  }
}
