import { useEffect, useState, } from 'react'
import {
  getClient, FaasDataProps, FaasReactClientInstance
} from '@faasjs/react'

export type FaasDataRender<T = any> = (args: {
  data: T
}) => JSX.Element

export type FaasDataWrapperProps<T = any> = {
  dataSource?: T
  faasData?: FaasDataProps<T>
  render?: FaasDataRender<T>
}

export function FaasDataWrapper<T = any> ({
  dataSource,
  faasData,
  render,
}: FaasDataWrapperProps<T>) {
  const [client, setClient] = useState<FaasReactClientInstance>()

  useEffect(() => {
    if (!faasData) return

    setClient(getClient())
  }, [])

  if (!faasData)
    return render({ data: dataSource })

  if (!client) return faasData?.fallback || null

  console.log(faasData)
  return <client.FaasData
    render={ faasData.render || render }
    { ...faasData }
  />
}
