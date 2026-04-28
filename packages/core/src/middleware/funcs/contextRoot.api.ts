import { useMiddleware } from '../../middleware'

export default useMiddleware((_, response, { root }) => {
  response.end(root)
})
