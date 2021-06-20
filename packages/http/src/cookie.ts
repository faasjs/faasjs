import { Session, SessionOptions } from './session';
import deepMerge from '@faasjs/deep_merge';

export interface CookieOptions {
  domain?: string
  path?: string
  expires?: number
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
  session?: SessionOptions
  [key: string]: any
}

export class Cookie<C, S> {
  public session: Session<S, C>
  public content: C
  public readonly config: {
    domain?: string
    path: string
    expires: number
    secure: boolean
    httpOnly: boolean
    sameSite?: 'Strict' | 'Lax' | 'None'
    session: SessionOptions
  }

  private setCookie: {
    [key: string]: string
  }

  constructor (config: CookieOptions) {
    this.config = deepMerge({
      path: '/',
      expires: 31536000,
      secure: true,
      httpOnly: true,
      session: {}
    }, config);

    this.session = new Session(this, this.config.session);

    this.content = Object.create(null);

    this.setCookie = Object.create(null);
  }

  public invoke (cookie: string | undefined): Cookie<C, S> {
    this.content = Object.create(null);

    // 解析 cookie
    if (cookie) 
      cookie.split(';').map((x: string) => {
        x = x.trim();
        const k = /([^=]+)/.exec(x);
        if (k !== null) this.content[k[0]] = decodeURIComponent(x.replace(`${k[0]}=`, '').replace(/;$/, '')); 
      });
    

    this.setCookie = Object.create(null);
    // 预读取 session
    this.session.invoke(this.read(this.session.config.key));
    return this;
  }

  public read (key: string): any {
    return this.content[key];
  }

  public write (key: string, value: string, opts?: {
    domain?: string
    path?: string
    expires?: number | string
    secure?: boolean
    httpOnly?: boolean
    sameSite?: 'Strict' | 'Lax' | 'None'
  }): Cookie<C, S> {
    opts = Object.assign(this.config, (opts != null) || {});

    let cookie: string;
    if (value === null || typeof value === 'undefined') {
      opts.expires = 'Thu, 01 Jan 1970 00:00:01 GMT';
      cookie = `${key}=;`;
      delete this.content[key];
    } else {
      cookie = `${key}=${encodeURIComponent(value)};`;
      this.content[key] = value;
    }

    if (typeof opts.expires === 'number') cookie += `max-age=${opts.expires};`; else if (typeof opts.expires === 'string') cookie += `expires=${opts.expires};`; 

    cookie += `path=${opts.path || '/'};`;

    if (opts.domain) cookie += `domain=${opts.domain};`; 

    if (opts.secure) cookie += 'Secure;'; 

    if (opts.httpOnly) cookie += 'HttpOnly;'; 

    if (opts.sameSite) cookie += `SameSite=${opts.sameSite};`; 

    this.setCookie[key] = cookie;

    return this;
  }

  public headers (): {
    'Set-Cookie'?: string[]
  } {
    if (Object.keys(this.setCookie).length === 0) return {}; else return { 'Set-Cookie': Object.values(this.setCookie) }; 
  }
}
