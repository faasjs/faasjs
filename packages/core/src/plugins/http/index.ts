export { Cookie, type CookieOptions } from './cookie'

export { Session, type SessionContent, type SessionOptions } from './session'

export { ContentType } from './types'
export type {
  HttpConfig,
  Response,
  HttpResponseBody,
  HttpSetHeader,
  HttpSetContentType,
  HttpSetStatusCode,
  HttpSetBody,
} from './types'

export { HttpError } from './http-error'

export { Http } from './http'

import type { HttpSetHeader, HttpSetContentType, HttpSetStatusCode, HttpSetBody } from './types'

declare module '@faasjs/core' {
  interface DefineApiInject {
    headers: Record<string, any>
    body: any
    setHeader: HttpSetHeader
    setContentType: HttpSetContentType
    setStatusCode: HttpSetStatusCode
    setBody: HttpSetBody
  }
}
