import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { Logger } from '@faasjs/node-utils'
import { afterEach, describe, expect, it } from 'vitest'

import { createMockReq, createMockRes } from '../../server/__tests__/mocks'
import { reactSsrHandler } from '../index'
import type { MiddlewareContext } from '../middleware'

function createContext(root: string): MiddlewareContext {
  const logger = new Logger('test:react-ssr')
  logger.silent = true

  return {
    logger,
    root,
  }
}

function createFixture(options?: { withRootFallback?: boolean; routeFiles?: string[] }) {
  const root = mkdtempSync(join(tmpdir(), 'faasjs-react-ssr-handler-'))
  const srcRoot = join(root, 'src')
  const distRoot = join(root, 'dist')
  const distReactSsrRoot = join(root, 'dist-server')

  mkdirSync(join(srcRoot, 'pages'), { recursive: true })
  mkdirSync(join(distRoot, 'assets'), { recursive: true })
  mkdirSync(distReactSsrRoot, { recursive: true })

  writeFileSync(
    join(srcRoot, 'pages', 'index.tsx'),
    'export default function HomePage() { return null }\n',
  )

  if (options?.withRootFallback)
    writeFileSync(
      join(srcRoot, 'pages', 'default.tsx'),
      'export default function NotFoundPage() { return null }\n',
    )

  for (const routeFile of options?.routeFiles || []) {
    const routePath = join(srcRoot, routeFile)

    mkdirSync(join(routePath, '..'), { recursive: true })
    writeFileSync(routePath, 'export const func = {}\n')
  }

  writeFileSync(
    join(distRoot, 'index.html'),
    [
      '<!doctype html>',
      '<html>',
      '  <body>',
      '    <div id="root"></div>',
      '  </body>',
      '</html>',
    ].join('\n'),
  )

  writeFileSync(join(distRoot, 'assets', 'app.js'), 'console.log("asset")\n')

  writeFileSync(
    join(distReactSsrRoot, 'entry-server.mjs'),
    [
      'export async function renderPage({ pathname, query }) {',
      "  if (pathname === '/') {",
      "    const name = Array.isArray(query.name) ? query.name[0] : (query.name || 'FaasJS')",
      '    return { html: `<h1>Hello, ${name}!</h1>`, props: { name } }',
      '  }',
      "  if (pathname === '/missing') {",
      "    return { html: '<h1>Missing</h1>', statusCode: 404, props: { pathname } }",
      '  }',
      '  return null',
      '}',
    ].join('\n'),
  )

  return {
    root,
    srcRoot,
    distRoot,
    distReactSsrRoot,
  }
}

describe('reactSsrHandler', () => {
  const created: string[] = []

  afterEach(() => {
    for (const root of created.splice(0)) rmSync(root, { recursive: true, force: true })
  })

  it('serves matched static assets before React SSR', async () => {
    const fixture = createFixture()
    created.push(fixture.root)

    const handler = reactSsrHandler({
      root: fixture.distRoot,
      serverRoot: fixture.distReactSsrRoot,
    })
    const req = createMockReq({
      method: 'GET',
      url: '/assets/app.js',
    })
    const res = createMockRes()

    await handler(req, res, createContext(fixture.srcRoot))

    expect(res.statusCode).toBe(200)
    expect(String(res._capturedData)).toBe('console.log("asset")\n')
  })

  it('serves matched static assets when the request URL includes a query string', async () => {
    const fixture = createFixture()
    created.push(fixture.root)

    const handler = reactSsrHandler({
      root: fixture.distRoot,
      serverRoot: fixture.distReactSsrRoot,
    })
    const req = createMockReq({
      method: 'GET',
      url: '/assets/app.js?v=1',
    })
    const res = createMockRes()

    await handler(req, res, createContext(fixture.srcRoot))

    expect(res.statusCode).toBe(200)
    expect(String(res._capturedData)).toBe('console.log("asset")\n')
  })

  it('renders HTML and serializes React SSR props', async () => {
    const fixture = createFixture()
    created.push(fixture.root)

    const handler = reactSsrHandler({
      root: fixture.distRoot,
      serverRoot: fixture.distReactSsrRoot,
    })
    const req = createMockReq({
      method: 'GET',
      url: '/?name=React',
      headers: {
        host: 'localhost',
      },
    })
    const res = createMockRes()

    await handler(req, res, createContext(fixture.srcRoot))

    const body = String(res._capturedData)

    expect(res.statusCode).toBe(200)
    expect(body).toContain('<div id="root"><h1>Hello, React!</h1></div>')
    expect(body).toContain('window.__FAASJS_REACT_SSR__={"props":{"name":"React"}}')
  })

  it('does not end the response when no React SSR page matches', async () => {
    const fixture = createFixture()
    created.push(fixture.root)

    const handler = reactSsrHandler({
      root: fixture.distRoot,
      renderPage: [join(fixture.distReactSsrRoot, 'entry-server.mjs')],
    })
    const req = createMockReq({
      method: 'GET',
      url: '/api/hello',
    })
    const res = createMockRes()

    await handler(req, res, createContext(fixture.srcRoot))

    expect(res.writableEnded).toBe(false)
  })

  it('supports explicit renderPage module paths for compatibility', async () => {
    const fixture = createFixture()
    created.push(fixture.root)

    const handler = reactSsrHandler({
      root: fixture.distRoot,
      renderPage: [join(fixture.distReactSsrRoot, 'entry-server.mjs')],
    })
    const req = createMockReq({
      method: 'GET',
      url: '/',
    })
    const res = createMockRes()

    await handler(req, res, createContext(fixture.srcRoot))

    expect(res.statusCode).toBe(200)
    expect(String(res._capturedData)).toContain('<div id="root"><h1>Hello, FaasJS!</h1></div>')
  })

  it('supports the built-in server-entry bundle name', async () => {
    const fixture = createFixture()
    created.push(fixture.root)

    writeFileSync(
      join(fixture.distReactSsrRoot, 'server-entry.js'),
      readFileSync(join(fixture.distReactSsrRoot, 'entry-server.mjs'), 'utf8'),
    )
    rmSync(join(fixture.distReactSsrRoot, 'entry-server.mjs'))

    const handler = reactSsrHandler({
      root: fixture.distRoot,
      serverRoot: fixture.distReactSsrRoot,
    })
    const req = createMockReq({
      method: 'GET',
      url: '/',
    })
    const res = createMockRes()

    await handler(req, res, createContext(fixture.srcRoot))

    expect(res.statusCode).toBe(200)
    expect(String(res._capturedData)).toContain('<div id="root"><h1>Hello, FaasJS!</h1></div>')
  })

  it('does not let fallback React SSR pages swallow matched function routes', async () => {
    const fixture = createFixture({
      withRootFallback: true,
      routeFiles: ['greeting/api/hello.func.ts'],
    })
    created.push(fixture.root)

    const handler = reactSsrHandler({
      root: fixture.distRoot,
      renderPage: async ({ pathname }) => ({
        html: `<h1>${pathname}</h1>`,
        props: {
          pathname,
        },
        statusCode: 404,
      }),
    })
    const req = createMockReq({
      method: 'GET',
      url: '/greeting/api/hello',
      headers: {
        accept: 'text/html',
      },
    })
    const res = createMockRes()

    await handler(req, res, createContext(fixture.srcRoot))

    expect(res.writableEnded).toBe(false)
  })

  it('still renders exact page routes when a function file exists at the same path', async () => {
    const fixture = createFixture({
      routeFiles: ['index.func.ts'],
    })
    created.push(fixture.root)

    const handler = reactSsrHandler({
      root: fixture.distRoot,
      serverRoot: fixture.distReactSsrRoot,
    })
    const req = createMockReq({
      method: 'GET',
      url: '/',
    })
    const res = createMockRes()

    await handler(req, res, createContext(fixture.srcRoot))

    expect(res.statusCode).toBe(200)
    expect(String(res._capturedData)).toContain('<div id="root"><h1>Hello, FaasJS!</h1></div>')
  })
})
