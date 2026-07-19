import { createFixtureVitestConfig } from '../create-vitest-config'

export default createFixtureVitestConfig({
  pool: 'threads',
  maxWorkers: 1,
  include: ['serial-*.case.ts'],
})
