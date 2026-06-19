import { describe, expect, it } from 'vitest'

import { parseCronExpression, type CronMatcher } from './index'

describe('parseCronExpression', () => {
  it('is exported from the package entrypoint', () => {
    const matchers: CronMatcher[] = parseCronExpression('*/15 9-17 * * 1-5')

    expect(matchers).toHaveLength(5)
    expect(matchers.map((matcher, index) => matcher([30, 12, 10, 6, 3][index]))).toEqual([
      true,
      true,
      true,
      true,
      true,
    ])
    expect(matchers[0](31)).toEqual(false)
  })
})
