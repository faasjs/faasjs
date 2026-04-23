import type { InvokeData, Next, Plugin } from '../../func'

const Name = 'handler'

/**
 * Built-in invoke plugin that executes `data.handler` at most once.
 *
 * It normalizes handler completion onto the shared invoke lifecycle and stores
 * the handler result on `data.response`.
 *
 * @example
 * ```ts
 * const func = new Func({
 *   plugins: [new RunHandler()],
 *   handler: async () => 'ok',
 * })
 * ```
 */
export class RunHandler implements Plugin {
  public readonly type = Name
  public readonly name = Name

  public async onInvoke(data: InvokeData, next: Next): Promise<void> {
    if (data.handler)
      if (!data.runHandler) {
        try {
          data.response = await Promise.resolve(data.handler?.(data))
        } catch (error: any) {
          data.logger.error(error)
          data.response = error
        }
        data.runHandler = true
      } else data.logger.warn('handler has been run')

    await next()
  }
}
