import { rollup } from '../../rollup';

export default function(){
  return [
    rollup(),
    rollup('src/jest.setup.js', [
      {
        file: 'lib/jest.setup.js'
      }
    ])
  ]
}
