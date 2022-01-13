import { useEffect, useState } from 'react'
import { getClient } from '@faasjs/react'

export function FaasDataWrapper<T = any> ({
  dataSource,
  faasData,
  render,
  fallback,
}: {
  dataSource?: T
  faasData?: {
    action: string
    params?: Record<string, any>
  }
  render: (args: {
    data: T
  }) => JSX.Element
  fallback?: JSX.Element
}) {
  const [data, setData] = useState<any>()

  useEffect(() => {
    if (!faasData) return

    getClient()
      .faas(faasData.action, faasData.action)
      .then(res => setData(res.data))
  }, [JSON.stringify(faasData)])

  if (dataSource) return render({ data: dataSource })

  if (!data) return fallback || null

  return render({ data })
}
