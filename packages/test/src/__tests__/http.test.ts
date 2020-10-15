import { FuncWarpper } from '../../src/index';

test('http', async function () {
  const func = new FuncWarpper(require.resolve('./funcs/http.func'));

  const res = await func.handler({}, {});

  expect(res.body).toEqual('{"data":true}');
});

test('JSONhandler data', async function () {
  const func = new FuncWarpper(require.resolve('./funcs/json.func'));

  const res = await func.JSONhandler<number>({ key: 1 });

  expect(res.body).toEqual('{"data":1}');
  expect(res.data).toEqual(1);
});

test('JSONhandler error', async function () {
  const func = new FuncWarpper(require.resolve('./funcs/http-error.func'));

  const res = await func.JSONhandler();

  expect(res.error.message).toEqual('message');
});
