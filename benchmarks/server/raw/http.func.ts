import { useFunc, useHttp } from '@faasjs/core'

export const func = useFunc(() => {
  useHttp()
  return async () => 'Hello'
})
