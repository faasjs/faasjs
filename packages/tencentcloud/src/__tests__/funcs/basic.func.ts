import { Func, InvokeData } from '@faasjs/func';

export default new Func({
  handler (data: InvokeData): any {
    return data.event + 1;
  }
});
