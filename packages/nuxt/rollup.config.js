import typescript from 'rollup-plugin-typescript2';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/index.js',
        format: 'cjs'
      },
      {
        file: 'lib/index.es.js',
        format: 'es'
      }
    ],
    plugins: [
      typescript()
    ]
  },
  {
    input: 'src/plugins/browser.ts',
    output: [
      {
        file: 'lib/plugins/browser.js',
        format: 'esm'
      }
    ],
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            module: 'es6'
          }
        }
      })
    ]
  },
  {
    input: 'src/plugins/server.ts',
    output: [
      {
        file: 'lib/plugins/server.js',
        format: 'cjs'
      }
    ],
    plugins: [
      typescript()
    ]
  }
];
