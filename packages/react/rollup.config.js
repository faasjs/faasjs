import { rollup } from '../../rollup'

export default rollup(
  'src/index.ts',
  [
    {
      file: 'lib/index.js',
      format: 'umd',
      name: 'FaasClient',
      exports: 'named',
      globals: { '@faasjs/browser': 'FaasBrowserClient' },
    }
  ]
)
