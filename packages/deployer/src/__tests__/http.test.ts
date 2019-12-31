import { Deployer } from '../index';
import { execSync } from 'child_process';

test('http', async function () {
  const deployer = new Deployer({
    root: __dirname,
    filename: __dirname + '/funcs/http.func.ts',
    env: 'testing'
  });
  const info = await deployer.deploy();

  const res = execSync(`node -e "const handler = require('${info.tmp}index.js').handler;(async function invoke(){console.log('|'+JSON.stringify(await handler({body:'0'}))+'|');})(handler);"`, {
    cwd: info.tmp
  }).toString();

  const data = JSON.parse(res.match(/([^|]+)|$/g)[1]);

  expect(data.statusCode).toEqual(200);
  expect(data.body).toEqual('{"data":"0"}');
}, 30000);
