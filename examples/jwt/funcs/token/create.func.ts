import { useFunc } from '@faasjs/func'
import { useHttp } from '@faasjs/http'
import { generateKeyPairSync } from 'crypto'
import { writeFileSync } from 'fs'
import { sign } from 'jsonwebtoken'

const passphrase = 'secret'

export default useFunc(function () {
  const http = useHttp<{
    deviceId: string
    version: string
  }>({
    validator: {
      params: {
        rules: {
          deviceId: { required: true },
          version: { required: true },
        },
      },
    },
  })

  return async function () {
    // 检查版本号
    if (http.params.version !== '1.0') throw Error('Unknown version')

    // 生成密钥和公钥
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase,
      },
    })

    // 存储密钥，此处仅为演示用，线上环境请勿存储在临时空间中
    writeFileSync(
      `./funcs/tmp/${http.params.deviceId}.key`,
      publicKey.toString()
    )

    // 返回公钥
    return {
      version: http.params.version,
      accessToken: sign(
        {
          sub: 'accessToken',
          deviceId: http.params.deviceId,
          version: http.params.version,
        },
        {
          key: privateKey,
          passphrase,
        },
        {
          algorithm: 'RS256',
          expiresIn: '10s',
        }
      ),
      refreshToken: sign(
        {
          sub: 'refreshToken',
          deviceId: http.params.deviceId,
          version: http.params.version,
        },
        {
          key: privateKey,
          passphrase,
        },
        { algorithm: 'RS256' }
      ),
    }
  }
})
