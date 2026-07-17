type CronField = {
  name: string
  min: number
  max: number
  normalize?: (value: number) => number
}

/**
 * Matcher generated for one cron expression field.
 *
 * @param value - Field value to test.
 * @returns `true` when the value matches the parsed cron field.
 */
export type CronMatcher = (value: number) => boolean

const CronFields: CronField[] = [
  { name: 'minute', min: 0, max: 59 },
  { name: 'hour', min: 0, max: 23 },
  { name: 'dayOfMonth', min: 1, max: 31 },
  { name: 'month', min: 1, max: 12 },
  { name: 'dayOfWeek', min: 0, max: 7, normalize: (value) => (value === 7 ? 0 : value) },
]

const WeekdayMap: Record<string, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
}

function parsePositiveInt(value: string): number {
  if (!/^\d+$/.test(value)) return Number.NaN

  return Number.parseInt(value, 10)
}

function invalidExpressionError(expression: string): Error {
  return Error(
    `[jobs] Invalid cron expression "${expression}". Expected 5 fields: minute hour dayOfMonth month dayOfWeek.`,
  )
}

function normalizeCronValue(value: number, field: CronField): number {
  return field.normalize ? field.normalize(value) : value
}

function parseCronValue(value: string, field: CronField): number {
  const parsed = parsePositiveInt(value)

  if (!Number.isInteger(parsed)) throw Error(`[jobs] Invalid ${field.name} segment "${value}".`)

  if (parsed < field.min || parsed > field.max)
    throw Error(
      `[jobs] ${field.name} value out of range: ${parsed}. Allowed range is ${field.min}-${field.max}.`,
    )

  return normalizeCronValue(parsed, field)
}

function collectRangeValues(segment: string, field: CronField): number[] {
  const [rangePart, stepPart] = segment.split('/')
  const step = stepPart === undefined ? 1 : parsePositiveInt(stepPart)

  if (!Number.isInteger(step) || step <= 0)
    throw Error(`[jobs] Invalid ${field.name} segment "${segment}".`)

  let start = field.min
  let end = field.max

  if (rangePart !== '*') {
    const range = rangePart.split('-')

    if (range.length === 1) {
      const value = parseCronValue(range[0], field)

      if (stepPart === undefined) return [value]

      start = value
    } else {
      if (range.length !== 2) throw Error(`[jobs] Invalid ${field.name} segment "${segment}".`)

      start = parseCronValue(range[0], field)
      end = parseCronValue(range[1], field)

      if (start > end) throw Error(`[jobs] Invalid ${field.name} range "${rangePart}".`)
    }
  }

  const values: number[] = []

  for (let value = start; value <= end; value += step) values.push(normalizeCronValue(value, field))

  return values
}

function createCronMatcher(segment: string, field: CronField): CronMatcher {
  const values = new Set<number>()

  for (const part of segment.split(',')) {
    const trimmed = part.trim()

    if (!trimmed) throw Error(`[jobs] Invalid ${field.name} segment "${segment}".`)

    for (const value of collectRangeValues(trimmed, field)) values.add(value)
  }

  return (value: number): boolean => values.has(value)
}

function parseCronSegments(expression: string): string[] {
  const trimmed = expression.trim()

  if (!trimmed) throw Error('[jobs] cron expression is required.')

  const segments = trimmed.split(/\s+/)

  if (segments.length !== 5) throw invalidExpressionError(expression)

  return segments
}

/**
 * Parse a cron expression into an array of field matchers.
 *
 * Accepts the standard 5-field format: `minute hour dayOfMonth month dayOfWeek`.
 * Supports comma-separated values, ranges (`-`), steps (`/`), and wildcards (`*`).
 * A single-value step such as `5/10` starts at 5 and continues to the field maximum.
 * Day-of-week accepts both numeric (0–7) and abbreviated names (SUN–SAT).
 *
 * @param expression - A cron expression string.
 * @returns An array of five matcher functions, one per field.
 * @throws {Error} If the expression is empty, has the wrong number of fields,
 * or contains invalid values.
 *
 * @example
 * ```ts
 * parseCronExpression('0 9 * * 1-5')
 * // every weekday at 9:00
 * ```
 */
export function parseCronExpression(expression: string): CronMatcher[] {
  const segments = parseCronSegments(expression)

  return CronFields.map((field, index) => createCronMatcher(segments[index], field))
}

function getZonedDateParts(now: Date, timezone?: string): number[] {
  if (!timezone)
    return [now.getMinutes(), now.getHours(), now.getDate(), now.getMonth() + 1, now.getDay()]

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    minute: 'numeric',
    hour: 'numeric',
    day: 'numeric',
    month: 'numeric',
    weekday: 'short',
    hourCycle: 'h23',
  })
  const parts = Object.create(null) as Record<string, string>

  for (const part of formatter.formatToParts(now)) {
    if (part.type !== 'literal') parts[part.type] = part.value
  }

  return [
    Number(parts.minute),
    Number(parts.hour),
    Number(parts.day),
    Number(parts.month),
    WeekdayMap[parts.weekday.toLowerCase()],
  ]
}

/**
 * Check whether a cron expression matches a given instant.
 *
 * @param expression - A cron expression string.
 * @param now - The instant to check.
 * @param timezone - Optional IANA timezone (e.g. `'America/New_York'`).
 * @returns `true` if the expression matches the instant.
 *
 * When both day-of-month and day-of-week are restricted, either field may
 * match. When one is `*`, the other field determines whether the day matches.
 *
 * @example
 * cronMatches('0 9 * * 1-5', new Date())
 * // true if the current time is a weekday at 9:00
 */
export function cronMatches(expression: string, now: Date, timezone?: string): boolean {
  const segments = parseCronSegments(expression)
  const matchers = CronFields.map((field, index) => createCronMatcher(segments[index], field))
  const values = getZonedDateParts(now, timezone)
  const otherFieldsMatch = [0, 1, 3].every((index) => matchers[index](values[index]))

  if (!otherFieldsMatch) return false

  const dayOfMonthMatches = matchers[2](values[2])
  const dayOfWeekMatches = matchers[4](values[4])

  if (segments[2] === '*') return dayOfWeekMatches
  if (segments[4] === '*') return dayOfMonthMatches

  return dayOfMonthMatches || dayOfWeekMatches
}

/**
 * Truncate a date to the current minute, zeroing out seconds and milliseconds.
 *
 * @param now - The date to truncate.
 * @returns A new `Date` set to the start of the minute.
 */
export function truncateToMinute(now: Date): Date {
  const scheduledAt = new Date(now)

  scheduledAt.setSeconds(0, 0)

  return scheduledAt
}
