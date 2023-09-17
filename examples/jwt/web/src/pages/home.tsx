import React from 'react'
import { useFaas } from 'libs/faas'
import { Skeleton } from 'antd'

export default function Home() {
  const { data } = useFaas('pages/home', {})

  if (!data) return <Skeleton active />

  return <div>home</div>
}
