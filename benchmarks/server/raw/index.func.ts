import { Func } from '@faasjs/func';

export default new Func({
  async handler () {
    return {
      statusCode: 200,
      body: 'Hello'
    };
  }
});
