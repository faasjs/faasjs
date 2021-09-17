import { rollup } from '../../rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default rollup(
  'src/index.ts',
  [
    {
      file: 'lib/index.js',
      format: 'umd',
      name: 'FaasReactClient',
      exports: 'named',
    }
  ],
  [nodeResolve()]
)
