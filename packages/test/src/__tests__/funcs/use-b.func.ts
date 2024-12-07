import { useFunc } from '@faasjs/func'
import { useHttp } from '@faasjs/http'

export default useFunc(() => {
  const http = useHttp()

  return async () => {
    if (!http.params.b) throw new Error('[params] b is required.')
  }
})
