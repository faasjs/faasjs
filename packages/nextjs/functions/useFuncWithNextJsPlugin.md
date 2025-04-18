[@faasjs/nextjs](../README.md) / useFuncWithNextJsPlugin

# Function: useFuncWithNextJsPlugin()

> **useFuncWithNextJsPlugin**\<`TParams`, `TResult`\>(`handler`, `plugins`?): (`params`?) => `Promise`\<`TResult`\>

Generate a function with NextJsPlugin.

## Type Parameters

### TParams

`TParams` *extends* `Record`\<`string`, `any`\> = `any`

### TResult

`TResult` = `any`

## Parameters

### handler

(`data`) => `Promise`\<`TResult`\>

### plugins?

`Plugin`[]

## Returns

> (`params`?): `Promise`\<`TResult`\>

### Parameters

#### params?

`TParams`

### Returns

`Promise`\<`TResult`\>

## Example

```ts
// create a function in server
'use server'
import { useFuncWithNextJsPlugin } from '@faasjs/nextjs'

export const serverAction = useFuncWithNextJsPlugin<{
  a: number
  b: number
}>(async ({ params }) => {
 return { message: params.a + params.b }
})

// using in client
'use client'
import { serverAction } from './server'

function App() {
  return <form action={serverAction}>
   <input name="a" type="number" />
   <input name="b" type="number" />
  <Button>Submit</Button>
</form>
}
```
