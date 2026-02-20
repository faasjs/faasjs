import { useFunc } from '@faasjs/core'

export const func = useFunc(() => async () => ({
  statusCode: 200,
  body: 'Hello',
}))
