import { InvokeData } from '../../index';

export default class RunHandler {
  public readonly type: string;
  public name?: string;

  constructor () {
    this.type = 'handler';
    this.name = 'handler';
  }

  public async onInvoke (data: InvokeData, next: () => void) {
    if (!data.runHandler) {
      data.logger.debug('[RunHandler] begin');
      data.logger.time('RunHandler');
      try {
        // eslint-disable-next-line require-atomic-updates
        data.response = await data.handler(data);
      } catch (error) {
        data.logger.error(error);
        // eslint-disable-next-line require-atomic-updates
        data.response = error;
      }
      // eslint-disable-next-line require-atomic-updates
      data.runHandler = true;
      data.logger.timeEnd('RunHandler', '[RunHandler] end %o', data.response);
    } else {
      data.logger.warn('[RunHandler] handler has been run');
    }

    next();
  }
}
