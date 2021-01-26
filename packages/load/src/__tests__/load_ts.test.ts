import { join } from 'path';
import loadTs from '../load_ts';

describe('loadTs', function () {
  test('extend', async function () {
    const res = await loadTs(require.resolve('./extend.func.ts'), { tmp: true });

    expect(res.module).toEqual('extended');
    expect(res.dependencies).toEqual({ '@faasjs/deep_merge': join(process.cwd(), 'node_modules', '@faasjs/deep_merge') });
  }, 10000);

  test('require', async function () {
    const res = await loadTs(require.resolve('./require.func.ts'), { tmp: true });

    expect(res.module).toEqual({ default: 'required' });
    expect(res.dependencies).toEqual({ '@faasjs/deep_merge': join(process.cwd(), 'node_modules', '@faasjs/deep_merge') });
  }, 10000);
});
