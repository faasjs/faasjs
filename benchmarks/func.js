const Benchmark = require('benchmark');
const Func = require('@faasjs/func').Func;
const Http = require('@faasjs/http').Http;

const suite = new Benchmark.Suite;

const handler = new Func({
  plugins: [],
  handler() {
    return;
  }
}).export().handler;

suite
  // .add('create', function () {
  //   new Func({
  //     plugins: [],
  //     handler() {
  //       return;
  //     }
  //   });
  // })
  // .add('export', function () {
  //   new Func({
  //     plugins: [],
  //     handler() {
  //       return;
  //     }
  //   }).export().handler;
  // })
  .add('handler', async function () {
    await handler({});
  })
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .run({ async: true });
