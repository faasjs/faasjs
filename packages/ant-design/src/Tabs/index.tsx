import type { Tab as OriginTabProps } from '@rc-component/tabs/lib/interface'
import { Tabs as Origin, type TabsProps as OriginProps } from 'antd'

/**
 * Tab item accepted by the FaasJS Ant Design {@link Tabs} wrapper.
 */
export interface TabProps extends Partial<OriginTabProps> {
  /** Stable tab identifier used as the default key and label. */
  id: string
  /** Title used as the default Ant Design tab label. */
  title?: React.ReactNode
  /** Tab panel content. */
  children: React.ReactNode
}

/**
 * Props for the FaasJS Ant Design {@link Tabs} component.
 */
export interface TabsProps extends Omit<OriginProps, 'items'> {
  /** Tab definitions. `null` and `false` entries are skipped automatically. */
  items: (TabProps | null | false)[]
}

/**
 * Render an Ant Design tabs wrapper that accepts FaasJS-style tab definitions.
 *
 * Missing `key` and `label` values are derived from each tab's `id` and `title`.
 *
 * @param {TabsProps} props - Tabs props including tab items and Ant Design tab options.
 *
 * @example
 * ```tsx
 * import { Tabs } from '@faasjs/ant-design'
 *
 * export function Page() {
 *   return (
 *     <Tabs
 *       items={[
 *         {
 *           id: 'id',
 *           children: 'content',
 *         },
 *         1 === 0 && {
 *           id: 'hidden',
 *           children: 'content',
 *         },
 *       ]}
 *     />
 *   )
 * }
 * ```
 */
export function Tabs(props: TabsProps) {
  return (
    <Origin
      {...props}
      items={(props.items.filter(Boolean) as TabProps[]).map((i) => ({
        ...i,
        key: i.key ?? i.id,
        label: i.label ?? i.title ?? i.id,
      }))}
    />
  )
}
