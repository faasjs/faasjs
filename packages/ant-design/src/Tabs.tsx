import { Tabs as Origin, TabsProps as OriginProps } from 'antd'
import type { Tab as OriginTabProps } from 'rc-tabs/es/interface'

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
export function Tabs(props: TabsProps) {
  return (
    <Origin
      {...props}
      items={props.items.filter(Boolean).map(i => ({
        ...i,
        key: i.key || i.id,
        label: i.label || i.title || i.id,
      }))}
    />
  )
}
