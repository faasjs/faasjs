[@faasjs/dev](../README.md) / viteFaasJsServer

# Function: viteFaasJsServer()

> **viteFaasJsServer**(`options?`): `Plugin`

Create a Vite plugin that proxies POST requests to an in-process FaasJS server.

It resolves project root/base from Vite config and strips `base` from request URL
before forwarding to `@faasjs/server`.

## Parameters

### options?

`Partial`\<[`ViteFaasJsServerOptions`](../type-aliases/ViteFaasJsServerOptions.md)\> & `Record`\<`string`, `unknown`\> = `{}`

## Returns

`Plugin`
