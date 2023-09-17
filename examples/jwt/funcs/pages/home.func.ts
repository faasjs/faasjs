import { useFunc } from '@faasjs/func'
import { useHttp } from '../http'

export default useFunc(function () {
  useHttp({})

  return async function () {
    return 1
  }
})
