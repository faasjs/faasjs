/* eslint-disable @typescript-eslint/no-var-requires */
const Benchmark = require('benchmark');
const Func = require('@faasjs/func').Func;
const suite = new Benchmark.Suite();

process.env.FaasLog = 'error';

const handler = new Func({ plugins: [] }).export().handler;

suite
  .add('create', function () {
    new Func({ plugins: [] });
  })
  .add('export', function () {
    new Func({ plugins: [] }).export();
  })
  .add('handler', async function () {
    await handler({});
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .run({ async: true });
