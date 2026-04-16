import { createCipheriv, createDecipheriv, createHmac, pbkdf2Sync, randomBytes } from 'node:crypto'

import type { Logger } from '@faasjs/node-utils'

import type { Cookie } from './cookie'

/**
 * Encryption and signing options for the {@link Session} helper.
 */
export type SessionOptions = {
  /**
   * Cookie key used to store the encrypted session payload.
   */
  key: string
  /**
   * Secret source used to derive encryption and signing keys.
   */
  secret: string
  /**
   * Salt used for deriving the encryption key.
   *
   * @default 'salt'
   */
  salt?: string
  /**
   * Salt used for deriving the signing key.
   *
   * @default 'signedSalt'
   */
  signedSalt?: string
  /**
   * Total derived key length in bytes.
   *
   * @default 64
   */
  keylen?: number
  /**
   * PBKDF2 iteration count used for key derivation.
   *
   * @default 100
   */
  iterations?: number
  /**
   * Hash algorithm used by PBKDF2 and HMAC.
   *
   * @default 'sha256'
   */
  digest?: string
  /**
   * Cipher name used to encrypt the session payload.
   *
   * @default 'aes-256-cbc'
   */
  cipherName?: string
}

/**
 * Allowed payload values stored in the session cookie.
 */
export type SessionContent = string | number | { [key: string]: any } | null | undefined

type SessionConfig = {
  key: string
  secret: string
  salt: string
  signedSalt: string
  keylen: number
  iterations: number
  digest: string
  cipherName: string
}

type SessionSecrets = {
  secret: Buffer
  signedSecret: Buffer
}

/**
 * Encrypted session storage backed by a signed cookie.
 *
 * @template S - Session value map exposed by `read()` and `content`.
 * @template C - Cookie value map exposed by the parent cookie store.
 *
 * @example
 * ```ts
 * import { Cookie } from '@faasjs/core'
 *
 * const cookie = new Cookie({
 *   secure: false,
 *   session: {
 *     key: 'session_id',
 *     secret: 'replace-me',
 *   },
 * })
 *
 * cookie.session.write('userId', '1').update()
 * cookie.headers()
 * ```
 */
export class Session<
  S extends Record<string, string> = any,
  C extends Record<string, string> = any,
> {
  /**
   * Decoded session values for the current request.
   */
  public content: Record<string, string | number>

  /**
   * Normalized session config with derived defaults.
   */
  public readonly config: SessionConfig

  private readonly secret: Buffer
  private readonly signedSecret: Buffer
  private readonly cookie: Cookie<C, S>
  private changed?: boolean

  /**
   * Create a session helper bound to a cookie store.
   *
   * @param {Cookie<C, S>} cookie - Parent cookie store used for persistence.
   * @param {SessionOptions | SessionConfig} config - Session encryption and cookie key options.
   * @param {string} config.key - Cookie key used to store the encrypted session payload.
   * @param {string} config.secret - Secret source used to derive encryption and signing keys.
   * @param {string} [config.salt] - Salt used for deriving the encryption key.
   * @param {string} [config.signedSalt] - Salt used for deriving the signing key.
   * @param {number} [config.keylen] - Total derived key length in bytes.
   * @param {number} [config.iterations] - PBKDF2 iteration count used for key derivation.
   * @param {string} [config.digest] - Hash algorithm used by PBKDF2 and HMAC.
   * @param {string} [config.cipherName] - Cipher name used to encrypt the session payload.
   * @param {SessionSecrets} [secrets] - Precomputed secrets reused by forked sessions.
   * @param {Buffer} [secrets.secret] - Derived encryption key reused by forked sessions.
   * @param {Buffer} [secrets.signedSecret] - Derived signing key reused by forked sessions.
   */
  constructor(
    cookie: Cookie<C, S>,
    config: SessionOptions | SessionConfig,
    secrets?: SessionSecrets,
  ) {
    this.cookie = cookie

    if (secrets) {
      this.config = config as SessionConfig
      this.secret = secrets.secret
      this.signedSecret = secrets.signedSecret
    } else {
      if (!config?.secret) cookie.logger?.warn("Session's secret is missing.")

      this.config = Object.assign(
        {
          key: 'key',
          secret: randomBytes(128).toString('hex'),
          salt: 'salt',
          signedSalt: 'signedSalt',
          keylen: 64,
          iterations: 100,
          digest: 'sha256',
          cipherName: 'aes-256-cbc',
        },
        config,
      )

      this.secret = pbkdf2Sync(
        this.config.secret,
        this.config.salt,
        this.config.iterations,
        this.config.keylen / 2,
        this.config.digest,
      )

      this.signedSecret = pbkdf2Sync(
        this.config.secret,
        this.config.signedSalt,
        this.config.iterations,
        this.config.keylen,
        this.config.digest,
      )
    }

    this.content = Object.create(null)
  }

  /**
   * Clone the session helper for a forked cookie store.
   *
   * @param {Cookie<C, S>} cookie - Forked cookie store.
   * @returns {Session<S, C>} Session helper sharing the same derived secrets.
   */
  public fork(cookie: Cookie<C, S>): Session<S, C> {
    return new Session(cookie, this.config, {
      secret: this.secret,
      signedSecret: this.signedSecret,
    })
  }

  /**
   * Decode the current session cookie into memory.
   *
   * @param {string} [cookie] - Encoded session cookie value.
   * @param {Logger} [logger] - Optional logger for decode failures.
   * @returns {void} No return value.
   */
  public invoke(cookie?: string, logger?: Logger): void {
    try {
      this.content = cookie ? this.decode(cookie) : Object.create(null)
    } catch (error: any) {
      logger?.error(error)
      this.content = Object.create(null)
    }
    this.changed = false
  }

  /**
   * Serialize session content into a signed, encrypted cookie string.
   *
   * Non-string payloads are JSON serialized before encryption.
   *
   * @param {SessionContent} text - Session payload to encode.
   * @returns {string} Encoded cookie value.
   */
  public encode(text: SessionContent): string {
    if (typeof text !== 'string') text = JSON.stringify(text)

    const iv = randomBytes(16)

    const cipher = createCipheriv(this.config.cipherName, this.secret, iv)
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]).toString('base64')

    const main = Buffer.from([encrypted, iv.toString('base64')].join('--')).toString('base64')

    const hmac = createHmac(this.config.digest, this.signedSecret)

    hmac.update(main)
    const digest = hmac.digest('hex')

    return `${main}--${digest}`
  }

  /**
   * Decode and verify a session cookie value.
   *
   * @template TData - Expected decoded payload shape.
   * @param {string} text - Encoded cookie value.
   * @returns {TData | SessionContent} Decoded session payload.
   * @throws {Error} When the signature is invalid or the payload cannot be decrypted.
   */
  public decode<TData = any>(text: string): TData | SessionContent {
    text = decodeURIComponent(text)

    const signedParts = text.split('--')
    const hmac = createHmac(this.config.digest, this.signedSecret)

    hmac.update(signedParts[0])
    const digest = hmac.digest('hex')

    if (signedParts[1] !== digest) throw Error('Session Not valid')

    const message = Buffer.from(signedParts[0], 'base64').toString()
    const parts = message.split('--').map((part) => Buffer.from(part, 'base64'))

    const cipher = createDecipheriv(this.config.cipherName, this.secret, parts[1])
    const part = Buffer.from(cipher.update(parts[0])).toString('utf8')
    const final = cipher.final('utf8')

    const decrypt = [part, final].join('')

    return JSON.parse(decrypt)
  }

  /**
   * Read a session value by key.
   *
   * @param {string} key - Session key.
   * @returns {string | number | undefined} Stored session value.
   */
  public read(key: string) {
    return this.content[key]
  }

  /**
   * Set or remove a session value in memory.
   *
   * @param {string} key - Session key.
   * @param {string | number | null | undefined} value - Session value, or `null`/`undefined` to delete it.
   * @returns {Session<S, C>} Current session helper for chaining.
   */
  public write(key: string, value?: string | number | null): Session<S, C> {
    if (value === null || typeof value === 'undefined') delete this.content[key]
    else this.content[key] = value

    this.changed = true
    return this
  }

  /**
   * Persist pending in-memory changes back to the session cookie.
   *
   * @returns {Session<S, C>} Current session helper for chaining.
   */
  public update(): Session<S, C> {
    if (this.changed) this.cookie.write(this.config.key, this.encode(this.content))

    return this
  }
}
