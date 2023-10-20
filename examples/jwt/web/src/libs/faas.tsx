import { v4 } from 'uuid'

const { useState, useEffect } = require('react')
import { FaasBrowserClient, Options, Response } from '@faasjs/browser'

export function FaasClient({
  domain,
  options,
  onError,
}: {
  domain: string
  options?: Options
  onError?(action: string, params: any): (res: any) => Promise<any>
}): {
  faas<T = any>(action: string, params: any): Promise<Response<T>>
  useFaas<THookData = any>(
    action: string,
    params?: any
  ): {
    loading: boolean
    data: THookData
    error: any
    promise: Promise<Response<THookData>>
  }
} {
  const client = new FaasBrowserClient(domain, options)

  return {
    async faas<T extends Record<string, any>>(action: string, params: any) {
      if (onError)
        return client.action<T>(action, params).catch(onError(action, params))
      return client.action<T>(action, params)
    },
    useFaas<T extends Record<string, any>>(action: string, params: any) {
      const [loading, setLoading] = useState(false)
      const [data, setData] = useState()
      const [error, setError] = useState()
      const [promise, setPromise] = useState()

      useEffect(
        function () {
          setLoading(true)
          const request = client.action<T>(action, params)
          setPromise(request)
          request
            .then(r => {
              setData(r?.data)
            })
            .catch(async e => {
              if (onError)
                try {
                  setData(await onError(action, params)(e))
                } catch (error) {
                  setError(error)
                }

              setError(e)
            })
            .finally(() => setLoading(false))
        },
        [action, JSON.stringify(params)]
      )

      return {
        loading,
        data,
        error,
        promise,
      }
    },
  }
}

const client = FaasClient({
  domain: process.env.REACT_APP_API as string,
  options: {
    beforeRequest: function ({ action, options }) {
      if (action === 'token/create' || !options.headers) return

      options.headers.XFaasToken = localStorage.getItem('accessToken') as string
    },
  },
  onError(action, params) {
    return async function (res) {
      if (res.status === 401) {
        // 检查设备编号是否生成
        let deviceId = localStorage.getItem('deviceId')
        if (!deviceId) {
          deviceId = v4()
          localStorage.setItem('deviceId', deviceId as string)
        }

        // 获取公钥
        const keys = await faas<{
          version: string
          accessToken: string
          refreshToken: string
        }>('token/create', {
          deviceId,
          version: '1.0',
        })

        localStorage.setItem('accessToken', keys.data.accessToken)
        localStorage.setItem('refreshToken', keys.data.refreshToken)

        return faas(action, params)
      }
    }
  },
})

export const faas = client.faas
export const useFaas = client.useFaas
