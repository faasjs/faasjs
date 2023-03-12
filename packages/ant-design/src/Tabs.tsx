import { Tabs as Origin, TabsProps as OriginProps } from 'antd'
import type { Tab as OriginTabProps } from 'rc-tabs/es/interface'
import { useEffect, useState } from 'react'

export interface TabProps extends Partial<OriginTabProps> {
  id: string
  title?: React.ReactNode
  children: React.ReactNode
}

export interface TabsProps extends Omit<OriginProps, 'items'> {
  /** auto skip null tab */
  items: (TabProps | null)[]
}

/**
 * Tabs component with Ant Design & FaasJS
 *
 * @ref https://ant.design/components/tabs/
 */
export function Tabs (props: TabsProps) {
  const [items, setItems] = useState<OriginTabProps[]>([])

  useEffect(() => {
    setItems(props.items.filter(Boolean).map(item => ({
      ...item,
      key: item.id,
      label: item.title || item.id,
    })))
  }, [props.items.filter(Boolean).map(i => i.id).join('')])

  return <Origin
    { ...props }
    items={ items }
  />
}
