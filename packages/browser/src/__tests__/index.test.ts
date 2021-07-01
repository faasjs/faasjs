/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-empty-function */

import { FaasBrowserClient } from '..'

let request: {
  method?: string;
  url?: string;
  headers: {
    [key: string]: string
  };
} = { headers: {} }

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.XMLHttpRequest = jest.fn().mockImplementation(function () {
  return {
    status: 200,
    response: {},
    open (method, url) {
      request.method = method
      request.url = url
    },
    setRequestHeader (key, value) {
      request.headers[key] = value
    },
    onerror () {},
    send () {
      this.onload()
    },
    getAllResponseHeaders () {
      return ''
    },
    getResponseHeader () {
      return null
    }
  }
})

describe('client', function () {
  beforeEach(function () {
    request = { headers: {} }
  })
  it('should work', async function () {
    const client = new FaasBrowserClient('/')
    await client.action('', {})

    expect(client.defaultOptions).toEqual({})
    expect(request.url.substring(0, 4)).toEqual('/?_=')
    expect(request.method).toEqual('POST')
    expect(request.headers).toEqual({ 'Content-Type': 'application/json; charset=UTF-8' })
  })
})
