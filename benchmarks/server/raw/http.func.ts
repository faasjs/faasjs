import { useFunc } from '@faasjs/func'
import { useHttp } from '@faasjs/http'

export default useFunc(() => {
  useHttp()
  return async () => 'Hello'
})
