import { Func, InvokeData } from '@faasjs/func';

export default new Func({
  handler(data: InvokeData) {
    return data.event + 1;
  }
});
