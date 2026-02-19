import { useFunc } from '@faasjs/func'
import { useHttp } from '@faasjs/core'

export const func = useFunc(() => {
  useHttp()
  return async () => 'Hello'
})
