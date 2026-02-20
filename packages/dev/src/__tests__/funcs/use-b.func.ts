import { useFunc } from '@faasjs/core'
import { useHttp } from '@faasjs/core'

export const func = useFunc(() => {
  const http = useHttp()

  return async () => {
    if (!http.params.b) throw new Error('[params] b is required.')
  }
})
