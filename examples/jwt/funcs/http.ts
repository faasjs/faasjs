import { Http, HttpConfig, useHttp as origin } from '@faasjs/http'
import { decode, verify } from 'jsonwebtoken'
import { readFileSync } from 'fs'

export function useHttp<TParams = any>(options: HttpConfig): Http {
  if (!options.validator) options.validator = {}
  if (!options.validator.before)
    options.validator.before = async function ({ headers }) {
      if (!headers.xfaastoken)
        return {
          statusCode: 401,
          message: 'Missing token',
        }

      const payload = decode(headers.xfaastoken) as {
        sub: string
        deviceId: string
      }

      try {
        const key = readFileSync(`./funcs/tmp/${payload.deviceId}.key`)
        const result = verify(headers.xfaastoken, key, {
          subject: 'accessToken',
          algorithms: ['RS256'],
        })
      } catch (error) {
        return {
          statusCode: 401,
          message: error.message,
        }
      }
    }

  return origin<TParams>(options)
}
