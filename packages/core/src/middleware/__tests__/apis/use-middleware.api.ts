import { useMiddleware } from '@faasjs/core'

export default useMiddleware(function handle(_, response) {
  response.end('useMiddleware')
})
