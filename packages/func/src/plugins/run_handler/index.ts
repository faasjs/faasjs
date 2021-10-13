import { InvokeData } from '../../index'

export default class RunHandler {
  public readonly type: string = 'handler'
  public readonly name: string = 'handler'

  public async onInvoke (data: InvokeData, next: () => Promise<void>): Promise<void> {
    if (data.handler)
      if (!data.runHandler) {
        try {
          data.response = await new Promise(function (resolve, reject) {
            data.callback = function (error: Error, result: any): void {
              if (error) reject(error); else resolve(result)
            }
            Promise.resolve(data.handler(data)).then(function (result: any) {
              resolve(result)
            }).catch(function (error: Error) {
              reject(error)
            })
          })
        } catch (error) {
          data.logger.error(error)
          data.response = error
        }
        data.runHandler = true
      } else data.logger.warn('[RunHandler] handler has been run')


    await next()
  }
}
