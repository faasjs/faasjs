import { Tabs as Origin, TabsProps as OriginProps } from 'antd'
import type { Tab as OriginTabProps } from 'rc-tabs/es/interface'

export interface TabProps extends Partial<OriginTabProps> {
  id: string
  title?: React.ReactNode
  children: React.ReactNode
}

export interface TabsProps extends Omit<OriginProps, 'items'> {
  /** auto skip null tab */
  items: (TabProps | null | false)[]
}

/**
 * Tabs component with Ant Design & FaasJS
 *
 * - Based on [Ant Design Tabs](https://ant.design/components/tabs/).
 * - Support auto skip null/false tab item.
 * - Support `id` as key and label.
 *
 * @example
 * ```tsx
 * import { Tabs } from '@faasjs/ant-design'
 *
 * <Tabs
 *   items={[
 *     {
 *       id: 'id',
 *       children: 'content',
 *     },
 *     1 === 0 && {
 *       id: 'hidden',
 *       children: 'content',
 *     },
 *   ]}
 * />
 * ```
 */
export function Tabs(props: TabsProps) {
  return (
    <Origin
      {...props}
      items={(props.items.filter(Boolean) as TabProps[]).map(i => ({
        ...i,
        key: i.key || i.id,
        label: i.label || i.title || i.id,
      }))}
    />
  )
}
