import loadTs from '../load_ts';

describe('loadTs', function () {
  test('extend', async function () {
    const res = await loadTs(require.resolve('./extend.func.ts'));

    expect(Object.keys(res.dependencies)).toEqual([]);
    expect(res.module).toEqual('extended');
  }, 10000);

  test('require', async function () {
    const res = await loadTs(require.resolve('./require.func.ts'));

    expect(Object.keys(res.dependencies)).toEqual([]);
    expect(res.module).toEqual({ default: 'required' });
  }, 10000);
});
