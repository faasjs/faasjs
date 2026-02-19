import { useFunc } from '@faasjs/func'
import { useHttp } from '@faasjs/core'
import Benchmark from 'benchmark'

const suite = new Benchmark.Suite()

process.env.FaasLog = 'error'

const plain = useFunc(() => () => {}).export().handler
const http = useFunc(() => {
  useHttp()
  return () => {}
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
