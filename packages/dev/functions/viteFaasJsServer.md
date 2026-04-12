[@faasjs/dev](../README.md) / viteFaasJsServer

# Function: viteFaasJsServer()

> **viteFaasJsServer**(): `Plugin`

Create a Vite plugin that forwards POST requests to an in-process FaasJS server.

The plugin resolves server settings from `src/faas.yaml`, strips the Vite
`base` prefix from request URLs, restarts the in-process server when source
files change, refreshes generated route declarations for `@faasjs/types`,
and exposes the `virtual:faasjs-pages` module used by
`@faasjs/react/routing`.

## Returns

`Plugin`

Vite plugin instance for local FaasJS development.

## See

[generateFaasTypes](generateFaasTypes.md)

## Example

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteFaasJsServer } from '@faasjs/dev'

export default defineConfig({
  plugins: [react(), viteFaasJsServer()],
})
```
