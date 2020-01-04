import typescript from 'rollup-plugin-typescript2';
import { sync } from 'glob';
import { basename } from 'path';

const external = sync(`../*/`).map(f => `@faasjs/${basename(f)}`);

function rollup (input, output) {
  if (!input) input = 'src/index.ts';

  if (!output) {
    output = [
      {
        file: 'lib/index.js',
        format: 'cjs'
      },
      {
        file: 'lib/index.es.js',
        format: 'es'
      }
    ];
  }

  return {
    input,
    output,
    external,
    plugins: [
      typescript({
        tsconfig: `${process.cwd()}/tsconfig.json`,
        tsconfigOverride: {
          exclude: ['**/__tests__']
        }
      })
    ]
  };
};

export {
  external,
  typescript,
  rollup
};
