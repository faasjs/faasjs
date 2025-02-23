import { useFunc } from '@faasjs/func'
import { useHttp } from '@faasjs/http'

export const func = useFunc(() => {
  const http = useHttp()

  return async () => {
    if (!http.params.b) throw new Error('[params] b is required.')
  }
})
