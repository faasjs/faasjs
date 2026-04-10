import { useMiddleware } from '../../../middleware'

export const func = useMiddleware((_, response, { root }) => {
  response.end(root)
})
