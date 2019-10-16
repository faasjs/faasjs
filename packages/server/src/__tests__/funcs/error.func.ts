import { Func } from '@faasjs/func';

export default new Func({
  handler () {
    throw Error('error');
  }
});
