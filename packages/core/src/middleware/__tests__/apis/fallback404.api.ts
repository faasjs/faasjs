import { staticHandler, useMiddleware } from '@faasjs/core'

export default useMiddleware(
  staticHandler({
    root: __dirname,
    notFound: 'use-middleware.api.ts',
  }),
)
