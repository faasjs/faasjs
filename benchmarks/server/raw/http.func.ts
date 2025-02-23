import { useFunc } from '@faasjs/func'
import { useHttp } from '@faasjs/http'

export const func = useFunc(() => {
  useHttp()
  return async () => 'Hello'
})
