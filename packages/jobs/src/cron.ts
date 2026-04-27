type CronField = {
  name: string
  min: number
  max: number
  normalize?: (value: number) => number
}

type CronMatcher = (value: number) => boolean

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

      return [value]
    }

    if (range.length !== 2) throw Error(`[jobs] Invalid ${field.name} segment "${segment}".`)

    start = parseCronValue(range[0], field)
    end = parseCronValue(range[1], field)

    if (start > end) throw Error(`[jobs] Invalid ${field.name} range "${rangePart}".`)
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

export function parseCronExpression(expression: string): CronMatcher[] {
  const trimmed = expression.trim()

  if (!trimmed) throw Error('[jobs] cron expression is required.')

  const segments = trimmed.split(/\s+/)

  if (segments.length !== 5) throw invalidExpressionError(expression)

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

export function cronMatches(expression: string, now: Date, timezone?: string): boolean {
  const matchers = parseCronExpression(expression)
  const values = getZonedDateParts(now, timezone)

  return matchers.every((matcher, index) => matcher(values[index]))
}

export function truncateToMinute(now: Date): Date {
  const scheduledAt = new Date(now)

  scheduledAt.setSeconds(0, 0)

  return scheduledAt
}
