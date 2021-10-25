import {
  randomBytes, pbkdf2Sync, createCipheriv, createHmac, createDecipheriv
} from 'crypto'
import { Cookie } from './cookie'

export type SessionOptions = {
  key: string
  secret: string
  salt?: string
  signedSalt?: string
  keylen?: number
  iterations?: number
  digest?: string
  cipherName?: string
}

export type SessionContent = string | number | { [key: string]: any } | null | undefined

export class Session<
  S extends Record<string, string> = any,
  C extends Record<string, string> = any
> {
  public content: Record<string, string>

  public readonly config: {
    key: string
    secret: string
    salt: string
    signedSalt: string
    keylen: number
    iterations: number
    digest: string
    cipherName: string
  }

  private readonly secret: Buffer
  private readonly signedSecret: Buffer
  private readonly cookie: Cookie<C, S>
  private changed?: boolean

  constructor (cookie: Cookie<C, S>, config: SessionOptions) {
    this.cookie = cookie

    this.config = Object.assign({
      key: 'key',
      secret: randomBytes(128).toString('hex'),
      salt: 'salt',
      signedSalt: 'signedSalt',
      keylen: 64,
      iterations: 100,
      digest: 'sha256',
      cipherName: 'aes-256-cbc'
    }, config)

    this.secret = pbkdf2Sync(
      this.config.secret,
      this.config.salt,
      this.config.iterations,
      this.config.keylen / 2,
      this.config.digest
    )

    this.signedSecret = pbkdf2Sync(
      this.config.secret,
      this.config.signedSalt,
      this.config.iterations,
      this.config.keylen,
      this.config.digest
    )

    this.content = Object.create(null)
  }

  public invoke (cookie?: string): void {
    try {
      this.content = cookie ? this.decode(cookie) : Object.create(null)
    } catch (error) {
      console.error(error)
      this.content = Object.create(null)
    }
    this.changed = false
  }

  public encode (text: SessionContent): string {
    if (typeof text !== 'string') text = JSON.stringify(text)

    const iv = randomBytes(16)

    const cipher = createCipheriv(this.config.cipherName, this.secret, iv)
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]).toString('base64')

    const main = Buffer.from([encrypted, iv.toString('base64')].join('--')).toString('base64')

    const hmac = createHmac(this.config.digest, this.signedSecret)

    hmac.update(main)
    const digest = hmac.digest('hex')

    return main + '--' + digest
  }

  public decode (text: string): SessionContent {
    text = decodeURIComponent(text)

    const signedParts = text.split('--')
    const hmac = createHmac(this.config.digest, this.signedSecret)

    hmac.update(signedParts[0])
    const digest = hmac.digest('hex')

    if (signedParts[1] !== digest) throw Error('Not valid')

    const message = Buffer.from(signedParts[0], 'base64').toString()
    const parts = message.split('--').map(function (part) {
      return Buffer.from(part, 'base64')
    })

    const cipher = createDecipheriv(this.config.cipherName, this.secret, parts[1])
    const part = Buffer.from(cipher.update(parts[0])).toString('utf8')
    const final = cipher.final('utf8')

    const decrypt = [part, final].join('')

    return JSON.parse(decrypt)
  }

  public read (key: string): string {
    return this.content[key]
  }

  public write (key: string, value?: string): Session<S, C> {
    if (value === null || typeof value === 'undefined')
      delete this.content[key]
    else
      this.content[key] = value

    this.changed = true
    return this
  }

  public update (): Session<S, C> {
    if (this.changed)
      this.cookie.write(this.config.key, this.encode(JSON.stringify(this.content)))

    return this
  }
}
