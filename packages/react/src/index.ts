import Client, {
  Options, Params, Response, ResponseError
} from '../../browser/src'

declare const React: {
  useState<T = any>(value?: T): [T, (value: T) => void]
  useEffect(...args: any): void
}

export function FaasReactClient ({
  domain,
  options,
  onError
}: {
  domain: string
  options?: Options
  onError?: (action: string, params: Params) => (res: ResponseError) => Promise<any>
}): {
    faas: <T = any>(action: string, params: Params) => Promise<Response<T>>
    useFaas: <T = any>(action: string, params: Params) => {
      loading: boolean
      data: T
      error: any
      promise: Promise<Response<T>>
      reload(params?: Params): Promise<Response<T>>
    }
  } {
  const client = new Client(domain, options)

  return {
    async faas<T = any> (action: string, params: Params) {
      if (onError) return client.action<T>(action, params).catch(onError(action, params))
      return client.action<T>(action, params)
    },
    useFaas<T = any> (action: string, defaultParams: Params) {
      const [loading, setLoading] = React.useState(false)
      const [data, setData] = React.useState<T>()
      const [error, setError] = React.useState()
      const [promise, setPromise] = React.useState<Promise<Response<T>>>()
      const [params, setParams] = React.useState(defaultParams)
      const [reloadTimes, setReloadTimes] = React.useState(0)

      React.useEffect(function () {
        if (JSON.stringify(defaultParams) !== JSON.stringify(params)) {
          setParams(defaultParams)
        }
      }, [defaultParams])

      React.useEffect(function () {
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

        return () => {
          setLoading(false)
        }
      }, [
        action,
        JSON.stringify(params),
        reloadTimes
      ])

      return {
        loading,
        data,
        error,
        promise,
        async reload (params?: any) {
          if (params) setParams(params)
          setReloadTimes(reloadTimes + 1)
          return promise
        }
      }
    }
  }
}
