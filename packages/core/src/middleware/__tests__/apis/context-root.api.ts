import { useMiddleware } from '@faasjs/core'

export default useMiddleware((_, response, { root }) => {
  response.end(root)
})
