import typescript from 'rollup-plugin-typescript2';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/index.js',
        format: 'cjs',
        banner: '#!/usr/bin/env node'
      }
    ],
    plugins: [
      typescript()
    ]
  }
];
