type LoopRunnerOptions = {
  interval: number
  logger: {
    error(error: unknown): void
  }
  task: () => Promise<unknown>
}

export class LoopRunner {
  private active = false
  private timer: NodeJS.Timeout | undefined
  private currentTask: Promise<void> | undefined

  constructor(private readonly options: LoopRunnerOptions) {}

  public start(): void {
    if (this.active) return

    this.active = true
    this.schedule(0)
  }

  public async stop(): Promise<void> {
    this.active = false

    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = undefined
    }

    if (this.currentTask) await this.currentTask
  }

  private schedule(delay: number): void {
    if (!this.active) return

    this.timer = setTimeout(() => {
      this.timer = undefined
      this.currentTask = Promise.resolve()
        .then(this.options.task)
        .catch((error) => {
          this.options.logger.error(error)
        })
        .then(() => undefined)
        .finally(() => {
          this.currentTask = undefined
          this.schedule(this.options.interval)
        })
    }, delay)
  }
}
