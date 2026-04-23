import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type PostgresFactory = (...args: any[]) => unknown

const postgresMock = vi.hoisted(() => vi.fn<PostgresFactory>())
const exampleUrl = 'postgres://typed-pg.test/example'

vi.mock('postgres', () => ({
  default: postgresMock,
}))

async function loadClientModule() {
  return import('../client')
}

async function loadBootstrapModule() {
  return import('../bootstrap')
}

function createSqlMock() {
  const sql = vi.fn<(...args: any[]) => Promise<unknown[]>>(async () => [])

  return Object.assign(sql, {
    end: vi.fn<() => Promise<void>>(async () => undefined),
  })
}

type ClientModule = Awaited<ReturnType<typeof loadClientModule>>
type BootstrapModule = Awaited<ReturnType<typeof loadBootstrapModule>>
type ClientInstance = InstanceType<ClientModule['Client']>
type SqlMock = ReturnType<typeof createSqlMock>

function lastSqlMock() {
  const sql = postgresMock.mock.results.at(-1)?.value

  if (!sql) throw new Error('Expected postgres to be called')

  return sql as SqlMock
}

function sqlMockFor(client: ClientInstance) {
  return client.postgres as unknown as SqlMock
}

describe('createClient', () => {
  let clientModule: ClientModule
  let bootstrapModule: BootstrapModule
  let previousDatabaseUrl: string | undefined
  let previousPoolMax: string | undefined

  beforeEach(async () => {
    postgresMock.mockReset()
    postgresMock.mockImplementation(() => createSqlMock())
    previousDatabaseUrl = process.env.DATABASE_URL
    previousPoolMax = process.env.PG_POOL_MAX
    delete process.env.DATABASE_URL
    delete process.env.PG_POOL_MAX
    vi.resetModules()
    clientModule = await loadClientModule()
    bootstrapModule = await loadBootstrapModule()
  })

  afterEach(() => {
    if (typeof previousDatabaseUrl === 'string') process.env.DATABASE_URL = previousDatabaseUrl
    else delete process.env.DATABASE_URL

    if (typeof previousPoolMax === 'string') process.env.PG_POOL_MAX = previousPoolMax
    else delete process.env.PG_POOL_MAX

    vi.restoreAllMocks()
  })

  it('forwards a connection string and options to postgres', () => {
    const options = { max: 1, ssl: false }

    const client = clientModule.createClient(exampleUrl, options)

    expect(postgresMock).toHaveBeenCalledWith(exampleUrl, options)
    expect(client.postgres).toBe(lastSqlMock())
  })

  it('forwards a connection string without options to postgres', () => {
    const client = clientModule.createClient(exampleUrl)

    expect(postgresMock).toHaveBeenCalledWith(exampleUrl, { max: 10 })
    expect(client.options).toEqual({ max: 10 })
    expect(client.postgres).toBe(lastSqlMock())
  })

  it('reads the default pool size from PG_POOL_MAX', async () => {
    process.env.PG_POOL_MAX = '23'
    vi.resetModules()
    clientModule = await loadClientModule()

    const client = clientModule.createClient(exampleUrl, { ssl: false })

    expect(postgresMock).toHaveBeenCalledWith(exampleUrl, { max: 23, ssl: false })
    expect(client.options).toEqual({ max: 23, ssl: false })
  })

  it('lets options.max override PG_POOL_MAX', async () => {
    process.env.PG_POOL_MAX = '23'
    vi.resetModules()
    clientModule = await loadClientModule()

    const options = { max: 3, ssl: false }
    const client = clientModule.createClient(exampleUrl, options)

    expect(postgresMock).toHaveBeenCalledWith(exampleUrl, options)
    expect(client.options).toBe(options)
  })

  it('allows Client to be constructed with the same connection-string arguments', () => {
    const options = { max: 1, ssl: false }

    const client = new clientModule.Client(exampleUrl, options)

    expect(postgresMock).toHaveBeenCalledWith(exampleUrl, options)
    expect(client.postgres).toBe(lastSqlMock())
    return expect(clientModule.getClient(exampleUrl)).resolves.toBe(client)
  })

  it('rejects non-string constructor arguments', () => {
    expect(() => new clientModule.Client(Symbol('invalid') as unknown as string)).toThrowError(
      'Client constructor only accepts a connection URL and optional options',
    )
    expect(postgresMock).not.toHaveBeenCalled()
  })

  it('creates an internal logger', () => {
    const options = { max: 1 }

    const client = clientModule.createClient(exampleUrl, options)

    expect(postgresMock).toHaveBeenCalledWith(exampleUrl, options)
    expect(client.logger).toBeDefined()
  })

  it('skips debug logging when logger level is not debug', async () => {
    const client = new clientModule.Client(exampleUrl)
    const sql = sqlMockFor(client)
    client.logger.level = 'info'

    const timeSpy = vi.spyOn(client.logger, 'time')

    expect(await client.raw('SELECT 1')).toEqual([])
    expect(timeSpy).not.toHaveBeenCalled()
    expect(sql).toHaveBeenCalledTimes(1)
  })

  it('records timing in debug mode', async () => {
    const client = new clientModule.Client(exampleUrl)
    const sql = sqlMockFor(client)

    const timeSpy = vi.spyOn(client.logger, 'time')
    const timeEndSpy = vi.spyOn(client.logger, 'timeEnd')

    expect(await client.raw('SELECT ?::integer', 1)).toEqual([])
    expect(sql).toHaveBeenCalledTimes(1)
    expect(timeSpy).toHaveBeenCalledTimes(1)
    expect(timeEndSpy).toHaveBeenCalledTimes(1)
  })

  it('logs and rethrows query errors in debug mode', async () => {
    const client = new clientModule.Client(exampleUrl)
    const sql = sqlMockFor(client)

    sql.mockImplementation(async () => {
      throw new Error('raw failed')
    })

    const timeEndSpy = vi.spyOn(client.logger, 'timeEnd')
    const errorSpy = vi.spyOn(client.logger, 'error')

    await expect(client.raw('SELECT 1')).rejects.toThrowError('raw failed')
    expect(timeEndSpy).toHaveBeenCalledTimes(1)
    expect(errorSpy).toHaveBeenCalledTimes(1)
  })

  it('caches clients by connection string and resolves the only cached client without a url', async () => {
    const client = clientModule.createClient(exampleUrl)

    await expect(clientModule.getClient(exampleUrl)).resolves.toBe(client)
    await expect(clientModule.getClient()).resolves.toBe(client)
  })

  it('throws without a url when multiple cached clients exist', async () => {
    const firstClient = clientModule.createClient('postgres://typed-pg.test/first')
    const secondClient = clientModule.createClient('postgres://typed-pg.test/second')

    await expect(clientModule.getClient('postgres://typed-pg.test/first')).resolves.toBe(
      firstClient,
    )
    await expect(clientModule.getClient('postgres://typed-pg.test/second')).resolves.toBe(
      secondClient,
    )
    await expect(clientModule.getClient()).rejects.toThrowError(
      'getClient() requires a connection URL when multiple clients are cached',
    )
  })

  it('creates and caches a client from the default database bootstrap when the cache is empty', async () => {
    process.env.DATABASE_URL = exampleUrl

    const client = await clientModule.getClient()

    expect(client).toBeDefined()
    expect(postgresMock).toHaveBeenCalledWith(exampleUrl, { max: 10 })
    await expect(clientModule.getClient(exampleUrl)).resolves.toBe(client)
    await expect(clientModule.getClient()).resolves.toBe(client)
    expect(postgresMock).toHaveBeenCalledTimes(1)
  })

  it('supports overriding the default database bootstrap', async () => {
    let bootstrapClient: ClientInstance | undefined
    const databaseBootstrap = vi.fn(async () => {
      bootstrapClient = clientModule.createClient(exampleUrl)
    })

    bootstrapModule.registerDatabaseBootstrap(databaseBootstrap)

    const client = await clientModule.getClient()

    expect(databaseBootstrap).toHaveBeenCalledTimes(1)
    expect(postgresMock).toHaveBeenCalledWith(exampleUrl, { max: 10 })
    expect(client).toBe(bootstrapClient)
    await expect(clientModule.getClient()).resolves.toBe(client)
    expect(databaseBootstrap).toHaveBeenCalledTimes(1)
  })

  it('waits for an in-flight bootstrap before resolving the default client', async () => {
    let continueBootstrap: (() => void) | undefined
    let bootstrapStarted: (() => void) | undefined
    const bootstrapStartedPromise = new Promise<void>((resolve) => {
      bootstrapStarted = resolve
    })

    bootstrapModule.registerDatabaseBootstrap(async () => {
      bootstrapStarted?.()
      await new Promise<void>((resolve) => {
        continueBootstrap = resolve
      })

      clientModule.createClient(exampleUrl)
    })

    const firstGetClient = clientModule.getClient()

    await bootstrapStartedPromise

    const secondGetClient = clientModule.getClient()

    continueBootstrap?.()

    const [firstClient, secondClient] = await Promise.all([firstGetClient, secondGetClient])

    expect(firstClient).toBe(secondClient)
    expect(firstClient.options).toEqual({ max: 10 })
    expect(postgresMock).toHaveBeenCalledTimes(1)
    expect(postgresMock).toHaveBeenNthCalledWith(1, exampleUrl, { max: 10 })
  })

  it('throws when PG_POOL_MAX is invalid', async () => {
    process.env.PG_POOL_MAX = 'abc'
    vi.resetModules()
    clientModule = await loadClientModule()

    expect(() => clientModule.createClient(exampleUrl)).toThrowError(
      'PG_POOL_MAX must be a positive integer',
    )
    expect(postgresMock).not.toHaveBeenCalled()
  })

  it('throws when no cached client exists and the default bootstrap cannot resolve a url', async () => {
    await expect(clientModule.getClient()).rejects.toThrowError(
      'DATABASE_URL is required when no cached client is available',
    )
  })

  it('throws when the custom bootstrap does not initialize a default client', async () => {
    bootstrapModule.registerDatabaseBootstrap(async () => {})

    await expect(clientModule.getClient()).rejects.toThrowError(
      'Database bootstrap did not initialize a default client',
    )
  })

  it('throws when requesting an uncached client by url', async () => {
    await expect(clientModule.getClient(exampleUrl)).rejects.toThrowError(
      `No cached client found for connection URL: ${exampleUrl}`,
    )
  })

  it('returns all cached clients without requiring a url', () => {
    const firstClient = clientModule.createClient('postgres://typed-pg.test/first')
    const secondClient = clientModule.createClient('postgres://typed-pg.test/second')

    expect(clientModule.getClients()).toEqual([firstClient, secondClient])
  })

  it('returns a snapshot of the cached clients', () => {
    const client = clientModule.createClient(exampleUrl)
    const cachedClients = clientModule.getClients()

    cachedClients.pop()

    expect(cachedClients).toEqual([])
    expect(clientModule.getClients()).toEqual([client])
  })

  it('removes the cached client on quit without evicting a newer client for the same url', async () => {
    const firstClient = clientModule.createClient(exampleUrl)
    const secondClient = clientModule.createClient(exampleUrl)
    const firstSql = sqlMockFor(firstClient)
    const secondSql = sqlMockFor(secondClient)

    await expect(firstClient.quit()).resolves.toBeUndefined()
    expect(firstSql.end).toHaveBeenCalledTimes(1)
    await expect(clientModule.getClient(exampleUrl)).resolves.toBe(secondClient)

    await expect(secondClient.quit()).resolves.toBeUndefined()
    expect(secondSql.end).toHaveBeenCalledTimes(1)
    await expect(clientModule.getClient(exampleUrl)).rejects.toThrowError(
      `No cached client found for connection URL: ${exampleUrl}`,
    )
    expect(clientModule.getClients()).toEqual([])
  })
})
