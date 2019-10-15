import { Func } from '@faasjs/func';
import { Http } from '@faasjs/http';

export default new Func({
  plugins: [new Http()],
  handler () {
    return true;
  }
});
