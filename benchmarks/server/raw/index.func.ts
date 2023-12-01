import { useFunc } from '@faasjs/func'

export default useFunc(() => async () => ({
  statusCode: 200,
  body: 'Hello',
}))
