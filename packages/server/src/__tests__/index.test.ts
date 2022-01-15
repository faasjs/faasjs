import { closeAll, Server } from '..'
import { request } from '@faasjs/request'
import { join, sep } from 'path'

describe('server', function () {
  let server: Server
  let port: number

  beforeAll(function () {
    port = 3001 + Math.floor(Math.random() * 10)
    server = new Server(join(__dirname, 'funcs'), { port })
    server.listen()
  })

  afterAll(async function () {
    await closeAll()
  })

  test('check config', async function () {
    expect(server.root).toEqual(join(__dirname, 'funcs', sep))
    expect(server.opts).toEqual({
      cache: false,
      port
    })
  })

  test('404', async function () {
    await expect(request('http://localhost:' + port + '/404')).rejects.toMatchObject({
      statusCode: 404,
      body: { error: { message: `Not found: ${server.root}404.func.ts or ${server.root}404/index.func.ts` } }
    })
  })

  test('hello', async function () {
    await expect(request('http://localhost:' + port + '/hello')).resolves.toMatchObject({
      statusCode: 200,
      body: { data: 'hello' }
    })
  })

  test('a', async function () {
    await expect(request('http://localhost:' + port + '/a')).resolves.toMatchObject({
      statusCode: 200,
      body: { data: 'a' }
    })
  })

  test('query', async function () {
    await expect(request('http://localhost:' + port + '/query?key=value')).resolves.toMatchObject({
      statusCode: 200,
      body: { data: { key: 'value' } }
    })
  })

  test('500', async function () {
    await expect(request('http://localhost:' + port + '/error')).rejects.toMatchObject({
      statusCode: 500,
      body: { error: { message: 'error' } }
    })
  })

  test('OPTIONS', async function () {
    await expect(request('http://localhost:' + port, { method: 'OPTIONS' })).resolves.toMatchObject({
      statusCode: 204,
      headers: {
        'access-control-allow-credentials': 'true',
        'access-control-allow-headers': 'Content-Type, Authorization',
        'access-control-allow-methods': 'OPTIONS, POST',
        'access-control-allow-origin': '*',
      }
    })
  })
})
