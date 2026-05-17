import { createFixtureVitestConfig } from '../create-vitest-config'

export default createFixtureVitestConfig({
  pool: 'forks',
  maxWorkers: 2,
  include: ['parallel-*.case.ts'],
})
