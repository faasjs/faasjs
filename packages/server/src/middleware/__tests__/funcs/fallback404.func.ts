import { staticHandler, useMiddleware } from '../../../middleware'

export const func = useMiddleware(
  staticHandler({
    root: __dirname,
    notFound: 'useMiddleware.func.ts',
  }),
)
