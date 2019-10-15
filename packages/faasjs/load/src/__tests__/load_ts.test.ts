import loadTs from '../load_ts';
import { execSync } from 'child_process';

describe('loadTs', function () {
  test('should work', async function () {
    const version = execSync('yarn list @faasjs/deep_merge').toString().match(/@([0-9a-z.-]+)[^@]*\n/)![1];

    expect(await loadTs(require.resolve('./base.ts'), {
      tmp: true
    })).toEqual({
      dependencies: { '@faasjs/deep_merge': version },
      module: 1
    });
  });
});
