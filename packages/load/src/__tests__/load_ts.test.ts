import loadTs from '../load_ts';

describe('loadTs', function () {
  test('should work', async function () {
    const res = await loadTs(require.resolve('./base.ts'), { tmp: true });

    expect(Object.keys(res.dependencies)).toEqual(['@faasjs/deep_merge']);
    expect(res.module).toEqual(1);
  });
});
