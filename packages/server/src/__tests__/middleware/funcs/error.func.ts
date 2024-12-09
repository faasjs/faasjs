import { useMiddleware } from '../../../middleware'

export default useMiddleware(function handle() {
  throw Error('useMiddleware')
})
