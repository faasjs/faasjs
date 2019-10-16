import typescript from 'rollup-plugin-typescript2';

export default {
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
};
