import { Func } from '@faasjs/func';
import { Http } from '@faasjs/http';

const http = new Http();

export default new Func({
  plugins: [http],
  handler () {
    return http.params.key;
  }
});
