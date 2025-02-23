import { useFunc } from '@faasjs/func'
import { useHttp } from '@faasjs/http'

export const func = useFunc(() => {
  const http = useHttp()

  return async () => {
    if (!http.params.a) throw new Error('[params] a is required.')
  }
})
