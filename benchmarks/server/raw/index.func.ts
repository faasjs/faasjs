import { useFunc } from '@faasjs/func'

export default useFunc(function () {
  return async function () {
    return {
      statusCode: 200,
      body: 'Hello',
    }
  }
})
