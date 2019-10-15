import * as crypto from 'crypto';
import { Cookie } from './cookie';

export interface SessionOptions {
  key: string;
  secret: string;
  salt?: string;
  signedSalt?: string;
  keylen?: number;
  iterations?: number;
  digest?: string;
  cipherName?: string;
}

export class Session {
  public content: {
    [key: string]: any;
  };

  public readonly config: {
    key: string;
    secret: string;
    salt: string;
    signedSalt: string;
    keylen: number;
    iterations: number;
    digest: string;
    cipherName: string;
  };
  private secret: Buffer;
  private signedSecret: Buffer;
  private cookie: Cookie;
  private changed?: boolean;

  constructor (cookie: Cookie, config: SessionOptions) {
    this.cookie = cookie;

    this.config = Object.assign({
      key: 'key',
      secret: crypto.randomBytes(128).toString('hex'),
      salt: 'salt',
      signedSalt: 'signedSalt',
      keylen: 64,
      iterations: 100,
      digest: 'sha256',
      cipherName: 'aes-256-cbc'
    }, config);

    this.secret = crypto.pbkdf2Sync(this.config.secret, this.config.salt!, this.config.iterations, this.config.keylen / 2, this.config.digest!);

    this.signedSecret = crypto.pbkdf2Sync(this.config.secret, this.config.signedSalt, this.config.iterations!, this.config.keylen, this.config.digest);

    this.content = Object.create(null);
  }

  public invoke (cookie?: string) {
    try {
      this.content = cookie ? this.decode(cookie) : Object.create(null);
    } catch (error) {
      console.error(error);
      this.content = Object.create(null);
    }
    this.changed = false;
  }

  public encode (text: any) {
    if (typeof text !== 'string') {
      text = JSON.stringify(text);
    }

    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(this.config.cipherName, this.secret, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]).toString('base64');

    const main = Buffer.from([encrypted, iv.toString('base64')].join('--')).toString('base64');

    const hmac = crypto.createHmac(this.config.digest, this.signedSecret);

    hmac.update(main);
    const digest = hmac.digest('hex');

    return main + '--' + digest;
  }

  public decode (text: string) {
    text = decodeURIComponent(text);

    const signedParts = text.split('--');
    const hmac = crypto.createHmac(this.config.digest, this.signedSecret);
    let digest;

    hmac.update(signedParts[0]);
    digest = hmac.digest('hex');

    if (signedParts[1] !== digest) {
      throw Error('Not valid');
    }

    const message = Buffer.from(signedParts[0], 'base64').toString();
    const parts = message.split('--').map(function (part) {
      return Buffer.from(part, 'base64');
    });

    const cipher = crypto.createDecipheriv(this.config.cipherName, this.secret, parts[1]);
    const part = Buffer.from(cipher.update(parts[0])).toString('utf8');
    const final = cipher.final('utf8');

    let decryptor = [part, final].join('');

    return JSON.parse(decryptor);
  }

  public read (key: string) {
    return this.content[key as string];
  }

  public write (key: string, value?: any) {
    if (value === null || typeof value === 'undefined') {
      delete this.content[key as string];
    } else {
      this.content[key as string] = value;
    }
    this.changed = true;
    return this;
  }

  public update () {
    if (this.changed) {
      this.cookie.write(this.config.key, this.encode(JSON.stringify(this.content)));
    }
    return this;
  }
}
