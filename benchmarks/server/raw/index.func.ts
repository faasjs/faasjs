import { Func } from '@faasjs/func';

export default new Func({
  plugins: [],
  handler() {
    return {
      statusCode: 200,
      body: 'Hello'
    };
  }
})
