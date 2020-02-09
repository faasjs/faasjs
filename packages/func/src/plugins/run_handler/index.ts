import { InvokeData } from '../../index';

export default class RunHandler {
  public readonly type: string;
  public name?: string;

  constructor () {
    this.type = 'handler';
    this.name = 'handler';
  }

  public async onInvoke (data: InvokeData, next: () => Promise<void>): Promise<void> {
    if (data.handler) {
      if (!data.runHandler) {
        data.logger.debug('[RunHandler] begin');
        data.logger.time('RunHandler');
        try {
          data.response = await new Promise(function (resolve: (result: any) => void, reject: (error: Error) => void) {
            data.callback = function (error: Error, result: any): void {
              if (error) {
                reject(error);
              }
              else {
                resolve(result);
              }
            };
            Promise.resolve(data.handler(data)).then(function (result: any) {
              resolve(result);
            }).catch(function (error: Error) {
              reject(error);
            });
          });
        } catch (error) {
          data.logger.error(error);
          data.response = error;
        }
        data.runHandler = true;
        data.logger.timeEnd('RunHandler', '[RunHandler] end %o', data.response);
      } else {
        data.logger.warn('[RunHandler] handler has been run');
      }
    }

    await next();
  }
}
