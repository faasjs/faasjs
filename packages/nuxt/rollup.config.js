import { external, typescript } from '../../rollup'

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
    external,
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
    external,
    plugins: [
      typescript({ tsconfigOverride: { compilerOptions: { module: 'es6' } } })
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
    external,
    plugins: [
      typescript()
    ]
  }
]
