const Benchmark = require('benchmark')
const useFunc = require('@faasjs/func').useFunc
const useHttp = require('@faasjs/http').useHttp
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
  .on('cycle', event => {
    console.log(String(event.target))
  })
  .run({ async: true })
