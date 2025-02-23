import { useFunc } from '@faasjs/func'

export const func = useFunc(() => async () => ({
  statusCode: 200,
  body: 'Hello',
}))
