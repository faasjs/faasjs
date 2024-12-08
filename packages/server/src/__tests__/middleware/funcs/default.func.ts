import { staticHandler, useMiddleware } from '../../../middleware'

export default useMiddleware(staticHandler({ root: `${__dirname}/`, notFound: true }))
