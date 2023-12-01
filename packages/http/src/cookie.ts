import type { Logger } from '@faasjs/logger'
import { Session, SessionOptions } from './session'
import { deepMerge } from '@faasjs/deep_merge'

export type CookieOptions = {
  domain?: string
  path?: string
  expires?: number
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
  session?: SessionOptions
  [key: string]: any
}

export class Cookie<
  C extends Record<string, string> = any,
  S extends Record<string, string> = any,
> {
  public session: Session<S, C>
  public content: Record<string, string>
  public readonly config: {
    domain?: string
    path: string
    expires: number
    secure: boolean
    httpOnly: boolean
    sameSite?: 'Strict' | 'Lax' | 'None'
    session: SessionOptions
  }
  public logger: Logger

  private setCookie: {
    [key: string]: string
  }

  constructor(config: CookieOptions, logger?: Logger) {
    this.logger = logger

    this.config = deepMerge(
      {
        path: '/',
        expires: 31536000,
        secure: true,
        httpOnly: true,
        session: {},
      },
      config
    )

    this.session = new Session(this, this.config.session)

    this.content = Object.create(null)

    this.setCookie = Object.create(null)
  }

  public invoke(cookie: string | undefined, logger: Logger): Cookie<C, S> {
    this.content = Object.create(null)

    // 解析 cookie
    if (cookie)
      for (const x of cookie.split(';')) {
        const trimX = x.trim()
        const k = /([^=]+)/.exec(trimX)
        if (k !== null)
          (this.content as any)[k[0]] = decodeURIComponent(
            trimX.replace(`${k[0]}=`, '').replace(/;$/, '')
          )
      }

    this.setCookie = Object.create(null)
    // 预读取 session
    this.session.invoke(this.read(this.session.config.key), logger)
    return this
  }

  public read(key: string): any {
    return this.content[key]
  }

  public write(
    key: string,
    value: string,
    opts?: {
      domain?: string
      path?: string
      expires?: number | string
      secure?: boolean
      httpOnly?: boolean
      sameSite?: 'Strict' | 'Lax' | 'None'
    }
  ): Cookie<C, S> {
    opts = Object.assign(this.config, opts || {})

    let cookie: string
    if (value === null || typeof value === 'undefined') {
      opts.expires = 'Thu, 01 Jan 1970 00:00:01 GMT'
      cookie = `${key}=;`
      delete this.content[key]
    } else {
      cookie = `${key}=${encodeURIComponent(value)};`
      this.content[key] = value
    }

    if (typeof opts.expires === 'number') cookie += `max-age=${opts.expires};`
    else if (typeof opts.expires === 'string')
      cookie += `expires=${opts.expires};`

    cookie += `path=${opts.path || '/'};`

    if (opts.domain) cookie += `domain=${opts.domain};`

    if (opts.secure) cookie += 'Secure;'

    if (opts.httpOnly) cookie += 'HttpOnly;'

    if (opts.sameSite) cookie += `SameSite=${opts.sameSite};`

    this.setCookie[key] = cookie

    return this
  }

  public headers(): { 'Set-Cookie'?: string[] } {
    if (Object.keys(this.setCookie).length === 0) return {}

    return { 'Set-Cookie': Object.values(this.setCookie) }
  }
}
