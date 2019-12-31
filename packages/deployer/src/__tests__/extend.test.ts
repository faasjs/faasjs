import { Deployer } from '../index';
import { execSync } from 'child_process';

test('extend', async function () {
  const deploy = new Deployer({
    root: __dirname,
    filename: __dirname + '/funcs/extend.func.ts',
    env: 'testing'
  });
  const info = await deploy.deploy();

  const res = execSync(`node -e "const handler = require('${info.tmp}index.js').handler;(async function invoke(){console.log('|'+JSON.stringify(await handler(0))+'|');})(handler);"`, {
    cwd: info.tmp
  }).toString();

  expect(res.match(/([^|]+)|$/g)[1]).toEqual('2');
}, 100000);
