import { staticHandler, useMiddleware } from '../../../middleware'

export const func = useMiddleware(
  staticHandler({
    root: __dirname,
    notFound: true,
    stripPrefix: '/default.',
    cache: 'test',
  })
)
