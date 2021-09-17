import { rollup } from '../../rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default rollup(
  'src/index.ts',
  [
    {
      file: 'lib/index.js',
      format: 'umd',
      exports: 'named',
      name: 'FaasVuePlugin',
    }
  ],
  [nodeResolve()]
)
