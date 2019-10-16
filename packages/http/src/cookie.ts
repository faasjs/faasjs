import { Session, SessionOptions } from './session';
import deepMerge from '@faasjs/deep_merge';

export interface CookieOptions {
  domain?: string;
  path?: string;
  expires?: number;
  secure?: boolean;
  httpOnly?: boolean;
  session?: SessionOptions;
  [key: string]: any;
}

export class Cookie {
  public session: Session;
  public content: {
    [key: string]: any;
  };
  public readonly config: {
    domain?: string;
    path: string;
    expires: number;
    secure: boolean;
    httpOnly: boolean;
    session: SessionOptions;
  };
  private setCookie: {
    [key: string]: string;
  };

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

  public invoke (cookie: string | undefined) {
    this.content = Object.create(null);

    // 解析 cookie
    if (cookie) {
      cookie.split(';').map((x: string) => {
        x = x.trim();
        const k = x.match(/([^=]+)/);
        if (k !== null) {
          this.content[k[0] as string] = decodeURIComponent(x.replace(`${k[0]}=`, '').replace(/;$/, ''));
        }
      });
    }

    this.setCookie = Object.create(null);
    // 预读取 session
    this.session.invoke(this.read(this.session.config.key));
    return this;
  }

  public read (key: string) {
    return this.content[key as string];
  }

  public write (key: string, value: any, opts?: {
    domain?: string;
    path?: string;
    expires?: number | string;
    secure?: boolean;
    httpOnly?: boolean;
  }) {
    opts = Object.assign(this.config, opts || {});

    let cookie: string;
    if (value === null || typeof value === 'undefined') {
      opts.expires = 'Thu, 01 Jan 1970 00:00:01 GMT';
      cookie = `${key}=;`;
      delete this.content[key as string];
    } else {
      cookie = `${key}=${encodeURIComponent(value)};`;
      this.content[key as string] = value;
    }

    if (typeof opts.expires === 'number') {
      cookie += `max-age=${opts.expires};`;
    } else if (typeof opts.expires === 'string') {
      cookie += `expires=${opts.expires};`;
    }

    cookie += `path=${opts.path || '/'};`;

    if (opts.domain) {
      cookie += `domain=${opts.domain};`;
    }

    if (opts.secure) {
      cookie += 'Secure;';
    }

    if (opts.httpOnly) {
      cookie += 'HttpOnly;';
    }

    this.setCookie[key as string] = cookie;

    return this;
  }

  public headers () {
    if (!Object.keys(this.setCookie).length) {
      return {};
    } else {
      return {
        'Set-Cookie': Object.values(this.setCookie)
      };
    }
  }
}
