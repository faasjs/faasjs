import { rollup } from '../../rollup';

export default rollup(
  'src/index.ts',
  [
    {
      file: 'lib/index.js',
      format: 'cjs',
      banner: '#!/usr/bin/env node\n'
    }
  ]
);
