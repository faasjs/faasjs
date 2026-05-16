import { staticHandler, useMiddleware } from '@faasjs/core'

export default useMiddleware(
  staticHandler({
    root: `${__dirname}/`,
    notFound: (_, res) => {
      res.statusCode = 404
      res.end('custom404')
    },
  }),
)
