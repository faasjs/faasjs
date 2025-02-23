import { staticHandler, useMiddleware } from '../../../middleware'

export const func = useMiddleware(
  staticHandler({
    root: `${__dirname}/`,
    notFound: (_, res) => {
      res.statusCode = 404
      res.end('custom404')
    },
  })
)
