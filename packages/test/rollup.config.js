import { rollup } from '../../rollup'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function () {
  return [
    rollup(),
    rollup('src/jest.setup.js', [
      { file: 'lib/jest.setup.js' }
    ])
  ]
}
