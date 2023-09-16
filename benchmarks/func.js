/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-var-requires */
const Benchmark = require('benchmark')
const useFunc = require('@faasjs/func').useFunc
const useHttp = require('@faasjs/http').useHttp
const suite = new Benchmark.Suite()

process.env.FaasLog = 'error'

const plain = useFunc(function () {
  return function () {}
}).export().handler
const http = useFunc(function () {
  useHttp()
  return function () {}
}).export().handler

suite
  .add('Plain func', async function () {
    await plain({})
  })
  .add('Http func', async function () {
    await http({})
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .run({ async: true })
