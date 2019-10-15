import loadNpmVersion from '../load_npm_version';
import { execSync } from 'child_process';

describe('loadNpmVersion', function () {
  test('should work', async function () {
    const version = execSync('yarn list typescript').toString().match(/@([0-9a-z.-]+)[^@]*\n/)![1];

    expect(loadNpmVersion('typescript')).toEqual(version);
    expect(loadNpmVersion('unknown')).toBeUndefined();
  });
});
