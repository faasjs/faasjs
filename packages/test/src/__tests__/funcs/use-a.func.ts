import { useFunc } from '@faasjs/func'
import { useHttp } from '@faasjs/http'

export default useFunc(() => {
  useHttp({ validator: { params: { rules: { a: { required: true } } } } })

  return async () => true
})
