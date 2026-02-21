import { expect, it } from 'vitest'
import * as Exports from '../index'

it('exports', () => {
  expect(Exports).toMatchObject({
    CronJob: expect.any(Function),
    createCronJob: expect.any(Function),
    removeCronJob: expect.any(Function),
    listCronJobs: expect.any(Function),
    useMiddleware: expect.any(Function),
    useMiddlewares: expect.any(Function),
    staticHandler: expect.any(Function),
    getAll: expect.any(Function),
    closeAll: expect.any(Function),
    Server: expect.any(Function),
  })
})
