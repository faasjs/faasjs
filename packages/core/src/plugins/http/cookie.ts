import { deepMerge } from '@faasjs/node-utils'
import type { Logger } from '@faasjs/node-utils'

import { Session, type SessionOptions } from './session'

/**
 * Cookie defaults and session integration options used by {@link Cookie}.
 */
export type CookieOptions = {
  /**
   * Cookie domain attribute.
   */
  domain?: string
  /**
   * Cookie path attribute.
   *
   * @default '/'
   */
  path?: string
  /**
   * Max age in seconds for persisted cookies.
   *
   * @default 31536000
   */
  expires?: number
  /**
   * Whether cookies require HTTPS transport.
   *
   * @default true
   */
  secure?: boolean
  /**
   * Whether cookies are hidden from client-side scripts.
   *
   * @default true
   */
  httpOnly?: boolean
  /**
   * SameSite attribute applied to written cookies.
   */
  sameSite?: 'Strict' | 'Lax' | 'None'
  /**
   * Session encryption and signing settings.
   */
  session?: SessionOptions
  [key: string]: any
}

type CookieConfig = {
  domain?: string
  path: string
  expires: number
  secure: boolean
  httpOnly: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
  session: SessionOptions
}

/**
 * Read, write, and serialize cookies for the HTTP plugin.
 *
 * @template C - Cookie value map exposed by `read()` and `content`.
 * @template S - Session value map exposed by the nested session helper.
 *
 * @example
 * ```ts
 * import { Cookie } from '@faasjs/core'
 *
 * const cookie = new Cookie({
 *   secure: false,
 *   session: { secret: 'replace-me' },
 * })
 *
 * cookie.write('theme', 'dark')
 * cookie.headers()
 * ```
 */
export class Cookie<
  C extends Record<string, string> = any,
  S extends Record<string, string> = any,
> {
  /**
   * Session helper bound to this cookie store.
   */
  public session: Session<S, C>
  /**
   * Parsed cookie key-value pairs for the current request.
   */
  public content: Record<string, string>
  /**
   * Normalized cookie configuration with defaults applied.
   */
  public readonly config: CookieConfig
  /**
   * Optional logger used for warnings and debug output.
   */
  public logger: Logger | undefined

  private setCookie: {
    [key: string]: string
  }

  /**
   * Create a cookie manager.
   *
   * @param {CookieOptions} config - Cookie defaults including session settings.
   * @param {string} [config.domain] - Cookie domain attribute.
   * @param {string} [config.path] - Cookie path attribute. Defaults to `/`.
   * @param {number} [config.expires] - Max age in seconds for persisted cookies.
   * @param {boolean} [config.secure] - Whether cookies require HTTPS transport.
   * @param {boolean} [config.httpOnly] - Whether cookies are hidden from client-side scripts.
   * @param {'Strict' | 'Lax' | 'None'} [config.sameSite] - SameSite attribute applied to written cookies.
   * @param {SessionOptions} [config.session] - Session-cookie encryption and signing settings.
   * @param {Logger} [logger] - Optional logger used by cookie and session helpers.
   * @param {{ template?: Cookie<C, S> }} [options] - Internal template reuse options.
   * @param {Cookie<C, S>} [options.template] - Existing cookie template reused by `fork()`.
   */
  constructor(
    config: CookieOptions,
    logger?: Logger,
    options?: {
      template?: Cookie<C, S>
    },
  ) {
    this.logger = logger

    if (options?.template) {
      this.config = options.template.config
      this.session = options.template.session.fork(this)
    } else {
      this.config = deepMerge(
        {
          path: '/',
          expires: 31536000,
          secure: true,
          httpOnly: true,
          session: {},
        },
        config,
      ) as CookieConfig

      this.session = new Session(this, this.config.session)
    }

    this.content = Object.create(null)

    this.setCookie = Object.create(null)
  }

  /**
   * Clone the cookie manager while reusing normalized config and secrets.
   *
   * @param {Logger} [logger] - Optional logger for the forked instance.
   * @returns {Cookie<C, S>} Forked cookie manager for a single invocation.
   */
  public fork(logger?: Logger): Cookie<C, S> {
    return new Cookie(this.config, logger, {
      template: this,
    })
  }

  /**
   * Load request cookies and bootstrap the related session state.
   *
   * @param {string | undefined} cookie - Raw `Cookie` header value.
   * @param {Logger} logger - Logger forwarded to the session helper.
   * @returns {Cookie<C, S>} Current cookie manager for chaining.
   */
  public invoke(cookie: string | undefined, logger: Logger): Cookie<C, S> {
    this.content = Object.create(null)

    // Parse cookies from the incoming request header.
    if (cookie)
      for (const x of cookie.split(';')) {
        const trimX = x.trim()
        const k = /([^=]+)/.exec(trimX)
        if (k !== null) {
          ;(this.content as any)[k[0]] = decodeURIComponent(
            trimX.replace(`${k[0]}=`, '').replace(/;$/, ''),
          )
        }
      }

    this.setCookie = Object.create(null)
    // Preload session data before request handlers access it.
    this.session.invoke(this.read(this.session.config.key), logger)
    return this
  }

  /**
   * Read a cookie value by key.
   *
   * @param {string} key - Cookie name.
   * @returns {string | undefined} Decoded cookie value for the current request.
   */
  public read(key: string): any {
    return this.content[key]
  }

  /**
   * Queue a cookie write or removal for the outgoing response.
   *
   * @param {string} key - Cookie name.
   * @param {string | null | undefined} value - Cookie value, or `null`/`undefined` to expire it.
   * @param {{ domain?: string; path?: string; expires?: number | string; secure?: boolean; httpOnly?: boolean; sameSite?: 'Strict' | 'Lax' | 'None' }} [opts] - Per-cookie attribute overrides.
   * @param {string} [opts.domain] - Cookie domain attribute override.
   * @param {string} [opts.path] - Cookie path attribute override.
   * @param {number | string} [opts.expires] - `max-age` seconds or absolute `expires` string override.
   * @param {boolean} [opts.secure] - Whether the written cookie requires HTTPS transport.
   * @param {boolean} [opts.httpOnly] - Whether the written cookie is hidden from client-side scripts.
   * @param {'Strict' | 'Lax' | 'None'} [opts.sameSite] - SameSite attribute override.
   * @returns {Cookie<C, S>} Current cookie manager for chaining.
   */
  public write(
    key: string,
    value: string | null | undefined,
    opts?: {
      domain?: string
      path?: string
      expires?: number | string
      secure?: boolean
      httpOnly?: boolean
      sameSite?: 'Strict' | 'Lax' | 'None'
    },
  ): Cookie<C, S> {
    const options = Object.assign({}, this.config, opts || {})
    const expires = opts?.expires ?? this.config.expires

    let cookie: string
    if (value === null || typeof value === 'undefined') {
      cookie = `${key}=;`
      cookie += 'expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      delete this.content[key]
    } else {
      cookie = `${key}=${encodeURIComponent(value)};`
      this.content[key] = value

      if (typeof expires === 'number') cookie += `max-age=${expires};`
      else if (typeof expires === 'string') cookie += `expires=${expires};`
    }

    cookie += `path=${options.path || '/'};`

    if (options.domain) cookie += `domain=${options.domain};`

    if (options.secure) cookie += 'Secure;'

    if (options.httpOnly) cookie += 'HttpOnly;'

    if (options.sameSite) cookie += `SameSite=${options.sameSite};`

    this.setCookie[key] = cookie

    return this
  }

  /**
   * Build `Set-Cookie` headers for queued writes.
   *
   * @returns {{ 'Set-Cookie'?: string[] }} Header bag suitable for merging into an HTTP response.
   */
  public headers(): { 'Set-Cookie'?: string[] } {
    if (Object.keys(this.setCookie).length === 0) return {}

    return { 'Set-Cookie': Object.values(this.setCookie) }
  }
}
