import { useFunc } from '@faasjs/core'
import { useHttp } from '@faasjs/core'

export const func = useFunc(() => {
  const http = useHttp()

  return async () => {
    if (!http.params.a) throw new Error('[params] a is required.')
  }
})
