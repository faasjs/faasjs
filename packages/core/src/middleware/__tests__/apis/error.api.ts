import { useMiddleware } from '@faasjs/core'

export default useMiddleware(function handle() {
  throw Error('useMiddleware')
})
