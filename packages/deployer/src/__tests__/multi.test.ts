import { Deployer } from '../index';
import { execSync } from 'child_process';

test('multi', async function () {
  const deployer = new Deployer({
    root: __dirname,
    filename: __dirname + '/funcs/multi.func.ts',
    env: 'testing'
  });
  const info = await deployer.deploy();

  const res = execSync(`node -e "const handler = require('${info.tmp}index.js').handler;(async function invoke(){console.log('|'+JSON.stringify(await handler(0))+'|');})(handler);"`, {
    cwd: info.tmp
  }).toString();
  console.log(res);
  expect(res.match(/([^|]+)|$/g)[1]).toEqual('1');
}, 100000);
