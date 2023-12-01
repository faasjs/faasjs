import { useFunc } from '@faasjs/func'
import { useHttp } from '@faasjs/http'

export default useFunc(() => {
  useHttp({ validator: { params: { rules: { b: { required: true } } } } })

  return async () => true
})
