import { useMiddleware } from '../../../middleware'

export const func = useMiddleware(function handle() {
  throw Error('useMiddleware')
})
