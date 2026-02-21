import { randomBytes } from 'node:crypto'
import { Logger } from '@faasjs/node-utils'

type CronFieldName = 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek'

type CronField = {
  name: CronFieldName
  min: number
  max: number
}

type CronMatcher = (value: number) => boolean

export type CronJobContext = {
  now: Date
  logger: Logger
  job: CronJob
}

export type CronJobHandler = (context: CronJobContext) => void | Promise<void>

export type CronJobErrorHandler = (error: Error, context: CronJobContext) => void | Promise<void>

export type CronJobOptions = {
  /**
   * Name of the cron job, used in logs.
   *
   * @default random name
   */
  name?: string
  /**
   * Cron expression in 5-field format:
   * minute hour dayOfMonth month dayOfWeek
   *
   * Supported syntax per field: wildcard (`*`), step (every n units), and fixed number.
   */
  expression: string
  /**
   * Job handler.
   */
  handler: CronJobHandler
  /**
   * Called when handler throws.
   */
  onError?: CronJobErrorHandler
  /**
   * Custom logger for this cron job.
   */
  logger?: Logger
}

const CronFields: readonly CronField[] = [
  { name: 'minute', min: 0, max: 59 },
  { name: 'hour', min: 0, max: 23 },
  { name: 'dayOfMonth', min: 1, max: 31 },
  { name: 'month', min: 1, max: 12 },
  { name: 'dayOfWeek', min: 0, max: 6 },
]

function toError(error: unknown): Error {
  if (error instanceof Error) return error

  return Error(String(error))
}

function parsePositiveInt(value: string): number {
  if (!/^\d+$/.test(value)) return Number.NaN

  return Number.parseInt(value, 10)
}

function invalidExpressionError(expression: string): Error {
  return Error(
    `[CronJob] Invalid expression "${expression}". Expected 5 fields: minute hour dayOfMonth month dayOfWeek.`,
  )
}

function createCronMatcher(segment: string, field: CronField): CronMatcher {
  if (segment === '*') return () => true

  if (segment.startsWith('*/')) {
    const step = parsePositiveInt(segment.slice(2))

    if (!Number.isInteger(step) || step <= 0)
      throw Error(`[CronJob] Invalid ${field.name} segment "${segment}".`)

    return (value: number): boolean => (value - field.min) % step === 0
  }

  const fixed = parsePositiveInt(segment)

  if (!Number.isInteger(fixed)) throw Error(`[CronJob] Invalid ${field.name} segment "${segment}".`)

  if (fixed < field.min || fixed > field.max)
    throw Error(
      `[CronJob] ${field.name} value out of range: ${fixed}. Allowed range is ${field.min}-${field.max}.`,
    )

  return (value: number): boolean => value === fixed
}

function parseExpression(expression: string): CronMatcher[] {
  const trimmed = expression.trim()

  if (!trimmed) throw Error('[CronJob] expression is required.')

  const segments = trimmed.split(/\s+/)

  if (segments.length !== 5) throw invalidExpressionError(expression)

  const matchers: CronMatcher[] = []

  for (const [index, field] of CronFields.entries()) {
    const segment = segments[index]

    if (typeof segment !== 'string') throw invalidExpressionError(expression)

    matchers.push(createCronMatcher(segment, field))
  }

  return matchers
}

function shouldRun(matchers: CronMatcher[], now: Date): boolean {
  const values = [now.getMinutes(), now.getHours(), now.getDate(), now.getMonth() + 1, now.getDay()]

  return matchers.every((matcher, index) => matcher(values[index]))
}

function getDelayToNextMinute(nowMs = Date.now()): number {
  const now = new Date(nowMs)

  now.setSeconds(0, 0)
  now.setMinutes(now.getMinutes() + 1)

  return now.getTime() - nowMs
}

/**
 * Simple cron job scheduler with 5-field cron expression support.
 */
export class CronJob {
  public readonly name: string
  public readonly expression: string
  public readonly handler: CronJobHandler
  private readonly onError: CronJobErrorHandler | undefined
  private readonly logger: Logger
  private readonly matchers: CronMatcher[]
  private timer: NodeJS.Timeout | undefined
  private started = false
  private lastTickMinute = -1

  constructor(options: CronJobOptions) {
    this.expression = options.expression
    this.handler = options.handler
    this.onError = options.onError
    this.name = options.name || `cron#${randomBytes(8).toString('hex')}`
    this.logger = options.logger || new Logger(`cron][${this.name}`)
    this.matchers = parseExpression(this.expression)
  }

  public start(): void {
    if (this.started) {
      this.logger.warn('start() has been called, skipped.')
      return
    }

    this.started = true
    this.lastTickMinute = -1

    this.logger.debug('[start] %s', this.expression)
    this.scheduleNext()
  }

  public stop(): void {
    if (!this.started) return

    this.started = false

    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = undefined
    }

    this.logger.debug('[stop]')
  }

  public get isStarted(): boolean {
    return this.started
  }

  private scheduleNext(): void {
    if (!this.started) return

    const delay = getDelayToNextMinute()

    this.timer = setTimeout(() => {
      this.tick()
    }, delay)
  }

  private tick(): void {
    if (!this.started) return

    this.scheduleNext()

    const now = new Date()
    const minute = Math.floor(now.getTime() / 60000)

    if (minute === this.lastTickMinute) return

    this.lastTickMinute = minute

    if (!shouldRun(this.matchers, now)) return

    void this.execute(now)
  }

  private async execute(now: Date): Promise<void> {
    const context: CronJobContext = {
      now,
      logger: this.logger,
      job: this,
    }

    try {
      await this.handler(context)
    } catch (error) {
      this.handleError(toError(error), context)
    }
  }

  private handleError(error: Error, context: CronJobContext): void {
    this.logger.error(error)

    if (!this.onError) return

    Promise.resolve(this.onError(error, context)).catch((onErrorError) => {
      this.logger.error(toError(onErrorError))
    })
  }
}

class CronJobRegistry {
  private readonly cronJobs = new Set<CronJob>()
  private mountedServerCount = 0

  public create(options: CronJobOptions): CronJob {
    const cronJob = new CronJob(options)

    this.cronJobs.add(cronJob)

    if (this.mountedServerCount > 0) cronJob.start()

    return cronJob
  }

  public remove(cronJob: CronJob): boolean {
    const removed = this.cronJobs.delete(cronJob)

    if (removed && this.mountedServerCount > 0) cronJob.stop()

    return removed
  }

  public list(): CronJob[] {
    return Array.from(this.cronJobs)
  }

  public mountServer(): void {
    this.mountedServerCount++

    if (this.mountedServerCount > 1) return

    for (const cronJob of this.cronJobs) cronJob.start()
  }

  public unmountServer(): void {
    if (this.mountedServerCount === 0) return

    this.mountedServerCount--

    if (this.mountedServerCount > 0) return

    for (const cronJob of this.cronJobs) cronJob.stop()
  }
}

const cronJobRegistry = new CronJobRegistry()

/**
 * Create and register a cron job.
 *
 * Registered jobs are managed by `Server` lifecycle automatically.
 */
export function createCronJob(options: CronJobOptions): CronJob {
  return cronJobRegistry.create(options)
}

export function removeCronJob(cronJob: CronJob): boolean {
  return cronJobRegistry.remove(cronJob)
}

export function listCronJobs(): CronJob[] {
  return cronJobRegistry.list()
}

export function mountServerCronJobs(): void {
  cronJobRegistry.mountServer()
}

export function unmountServerCronJobs(): void {
  cronJobRegistry.unmountServer()
}
