import { rollup } from '../../rollup'

export default rollup(
  'src/index.ts',
  [
    {
      file: 'lib/index.js',
      format: 'umd',
      exports: 'named',
      globals: { '@faasjs/browser': 'FaasBrowserClient' },
      name: 'FaasVuePlugin',
    }
  ]
)
