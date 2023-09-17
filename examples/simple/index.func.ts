import { useFunc } from '@faasjs/func'
import { useHttp } from '@faasjs/http'

export default useFunc(function () {
  useHttp()

  return async function () {
    return 'Hello, world'
  }
})
