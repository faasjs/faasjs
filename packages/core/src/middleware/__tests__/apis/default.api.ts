import { staticHandler, useMiddleware } from '@faasjs/core'

export default useMiddleware(
  staticHandler({
    root: __dirname,
    notFound: true,
    stripPrefix: '/default.',
    cache: 'test',
  }),
)
