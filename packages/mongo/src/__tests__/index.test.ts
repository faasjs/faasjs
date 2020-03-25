import { Mongo } from '../index';
import { Func } from '@faasjs/func';

describe('mongo', function () {
  it('with filename', async function () {
    const mongo = new Mongo({
      config: {
        url: 'mongodb://localhost',
        database: 'test'
      }
    });

    const func = new Func({
      plugins: [mongo],
      handler () {
        return mongo.client.db('test').collection('test').find({ $expr: { $eq: [1, 1] } });
      }
    });
    const handler = func.export().handler;

    expect(await handler({})).toEqual([{ '1+1': 2 }]);
  });
});
