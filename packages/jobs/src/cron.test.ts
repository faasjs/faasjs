import { describe, expect, it } from 'vitest'

import { cronMatches } from './cron'
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

  it('applies steps from a single starting value through the field maximum', () => {
    const [minute] = parseCronExpression('5/10 * * * *')

    expect([0, 5, 15, 25, 35, 45, 55, 59].map((value) => minute(value))).toEqual([
      false,
      true,
      true,
      true,
      true,
      true,
      true,
      false,
    ])
  })

  it('matches either day-of-month or day-of-week when both are restricted', () => {
    const expression = '0 0 1 * 1'

    expect(cronMatches(expression, new Date('2026-06-08T00:00:00.000Z'), 'UTC')).toEqual(true)
    expect(cronMatches(expression, new Date('2026-07-01T00:00:00.000Z'), 'UTC')).toEqual(true)
    expect(cronMatches(expression, new Date('2026-07-02T00:00:00.000Z'), 'UTC')).toEqual(false)
  })

  it('requires the restricted day field when the other field is a wildcard', () => {
    const monday = new Date('2026-06-08T00:00:00.000Z')
    const firstOfMonth = new Date('2026-07-01T00:00:00.000Z')
    const neither = new Date('2026-07-02T00:00:00.000Z')

    expect(cronMatches('0 0 * * 1', monday, 'UTC')).toEqual(true)
    expect(cronMatches('0 0 * * 1', firstOfMonth, 'UTC')).toEqual(false)
    expect(cronMatches('0 0 1 * *', firstOfMonth, 'UTC')).toEqual(true)
    expect(cronMatches('0 0 1 * *', neither, 'UTC')).toEqual(false)
  })
})
