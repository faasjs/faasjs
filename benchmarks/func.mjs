import { Func, Http } from '@faasjs/core'
import Benchmark from 'benchmark'

const suite = new Benchmark.Suite()

process.env.FaasLog = 'error'

const plain = new Func({
  async handler() {},
}).export().handler
const http = new Func({
  plugins: [new Http()],
  async handler() {},
}).export().handler

suite
  .add('Plain func', async () => {
    await plain({})
  })
  .add('Http func', async () => {
    await http({})
  })
  .on('cycle', (event) => {
    console.log(String(event.target))
  })
  .run({ async: true })
