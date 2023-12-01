import { Deployer } from '../index'
import { execSync } from 'child_process'

test('http', async () => {
  const deployer = new Deployer({
    root: __dirname,
    filename: `${__dirname}/funcs/http.func.ts`,
    env: 'testing',
    config: {},
    dependencies: {},
  })
  try {
    await deployer.deploy()
  } catch (error) {}

  const res = execSync(
    `node -e "const handler = require('${deployer.deployData.tmp}index.js').handler;(async function invoke(){console.log('|'+JSON.stringify(await handler({body:'0'}))+'|');})(handler);"`,
    { cwd: deployer.deployData.tmp }
  ).toString()

  const data = JSON.parse(res.match(/([^|]+)|$/g)[1])

  expect(data.statusCode).toEqual(200)
  expect(data.body).toEqual('{"data":"0"}')
})
