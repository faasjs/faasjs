import { useFunc } from '@faasjs/func'
import { useHttp } from '@faasjs/http'

export default useFunc(function () {
  const http = useHttp()

  return async function () {
    http.session.write('user_id', null)
  }
})
