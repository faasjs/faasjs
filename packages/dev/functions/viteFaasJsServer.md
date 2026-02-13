[@faasjs/dev](../README.md) / viteFaasJsServer

# Function: viteFaasJsServer()

> **viteFaasJsServer**(): `Plugin`

Create a Vite plugin that proxies POST requests to an in-process FaasJS server.

It resolves server root/base from `src/faas.yaml` and strips `base` from
request URL before forwarding to `@faasjs/server`.

## Returns

`Plugin`
