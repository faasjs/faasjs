import { rollup } from '../../rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default rollup(
  'src/index.ts',
  [
    {
      file: 'lib/index.js',
      format: 'iife',
      name: 'FaasReactClient',
      exports: 'named',
    }
  ],
  [nodeResolve({browser: true})]
)
