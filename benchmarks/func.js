/* eslint-disable @typescript-eslint/no-var-requires */
const Benchmark = require('benchmark')
const useFunc = require('@faasjs/func').useFunc
const suite = new Benchmark.Suite()

process.env.FaasLog = 'error'

const handler = useFunc({ plugins: [] }).export().handler

suite
  .add('create', function () {
    useFunc({ plugins: [] })
  })
  .add('export', function () {
    useFunc({ plugins: [] }).export()
  })
  .add('handler', async function () {
    await handler({})
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run({ async: true })
