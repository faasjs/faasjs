import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { useEqualEffect } from '@faasjs/react'
import { Descriptions, type DescriptionsProps, Space } from 'antd'
import type { Dayjs } from 'dayjs'
import { type JSX, type ReactNode, useState } from 'react'

import type { BaseItemProps } from '.'
import { Blank } from './Blank'
import {
  type FaasItemProps,
  idToTitle,
  transferValue,
  type UnionFaasItemElement,
  type UnionFaasItemRender,
} from './data'
import { FaasDataWrapper, type FaasDataWrapperProps } from './FaasDataWrapper'
import {
  normalizeSceneItem,
  renderSceneNode,
  shouldRenderSceneItem,
  transferOptionLabels,
} from './itemHelpers'

/**
 * Custom renderer registration for a description item type.
 *
 * @template T - Value type rendered by the custom description item type.
 */
export interface ExtendDescriptionTypeProps<T = any> {
  /** Custom element used to render the registered description item type. */
  children?: UnionFaasItemElement<T>
  /** Custom render callback used when `children` is not provided. */
  render?: UnionFaasItemRender<T>
}

/**
 * Shared fields for extending description item unions.
 */
export type ExtendDescriptionItemProps = BaseItemProps

/**
 * Item definition used by {@link Description}.
 *
 * @template T - Value type rendered by the item.
 */
export interface DescriptionItemProps<T = any> extends FaasItemProps {
  /** Generic custom element rendered when no description-specific child overrides it. */
  children?: UnionFaasItemElement<T> | null
  /** Description-specific custom element. */
  descriptionChildren?: UnionFaasItemElement<T> | null
  /** Generic custom render callback. */
  render?: UnionFaasItemRender<T> | null
  /** Description-specific custom render callback. */
  descriptionRender?: UnionFaasItemRender<T> | null
  /** Predicate used to hide the item for the current record. */
  if?: (values: Record<string, any>) => boolean
  /** Nested item definitions used by `object` and `object[]` item types. */
  object?: DescriptionItemProps<T>[]
}

/**
 * Props for the {@link Description} component.
 *
 * @template T - Data record shape rendered by the component.
 * @template ExtendItemProps - Additional item prop shape accepted by `items`.
 */
export interface DescriptionProps<T = any, ExtendItemProps = any> extends Omit<
  DescriptionsProps,
  'items'
> {
  /** Callback used to derive the rendered title from the current record. */
  renderTitle?(this: void, values: T): ReactNode
  /** Description item definitions rendered by the component. */
  items: (DescriptionItemProps | ExtendItemProps)[]
  /** Custom type renderers keyed by item type. */
  extendTypes?: {
    [key: string]: ExtendDescriptionTypeProps
  }
  /** Local data record rendered directly by the component. */
  dataSource?: T
  /** Request config used to fetch the record before rendering. */
  faasData?: FaasDataWrapperProps<any>
}

/**
 * Props passed to the exported `DescriptionItemContent` helper shape.
 *
 * @template T - Value type rendered by the item content.
 */
export interface DescriptionItemContentProps<T = any> {
  /** Item definition describing how the value should render. */
  item: DescriptionItemProps
  /** Current item value. */
  value: T
  /** Full record containing the current value. */
  values?: any
  /** Custom type renderers keyed by item type. */
  extendTypes?: {
    [key: string]: ExtendDescriptionTypeProps
  }
}

function DescriptionItemContent<T = any>(
  props: DescriptionItemContentProps<T>,
): JSX.Element | null {
  const [computedProps, setComputedProps] = useState<DescriptionItemContentProps<T>>()

  useEqualEffect(() => {
    const propsCopy = { ...props }

    normalizeSceneItem(propsCopy.item)

    propsCopy.value = transferValue(propsCopy.item.type, propsCopy.value)
    propsCopy.value = transferOptionLabels(
      propsCopy.item.type,
      propsCopy.item.options as {
        label: string
        value: any
      }[],
      propsCopy.value,
    ) as T

    setComputedProps(propsCopy)
  }, [props])

  if (!computedProps) return null

  const itemType = computedProps.item.type ?? 'string'

  if (!shouldRenderSceneItem(computedProps.item, 'description')) return null

  const customSceneNode = renderSceneNode({
    scene: 'description',
    item: computedProps.item as any,
    value: computedProps.value,
    values: computedProps.values,
    index: 0,
    extendType: computedProps.extendTypes?.[itemType] as any,
  })

  if (customSceneNode.matched) return <>{customSceneNode.node}</>

  if (
    computedProps.value === null ||
    (Array.isArray(computedProps.value) && !computedProps.value.length)
  )
    return <Blank />

  switch (itemType) {
    case 'string[]':
      return <>{(computedProps.value as string[]).join(', ')}</>
    case 'number':
      return (computedProps.value as any) || null
    case 'number[]':
      return <>{(computedProps.value as number[]).join(', ')}</>
    case 'boolean':
      return computedProps.value ? (
        <CheckOutlined
          style={{
            marginTop: '4px',
            color: '#52c41a',
          }}
        />
      ) : (
        <CloseOutlined
          style={{
            marginTop: '4px',
            color: '#ff4d4f',
          }}
        />
      )
    case 'time':
      return <>{(computedProps.value as Dayjs).format('YYYY-MM-DD HH:mm:ss')}</>
    case 'date':
      return <>{(computedProps.value as Dayjs).format('YYYY-MM-DD')}</>
    case 'object': {
      if (!computedProps.value) return <Blank />

      const objectItems = computedProps.item.object || []

      return <Description items={objectItems} dataSource={computedProps.value} column={1} />
    }
    case 'object[]':
      if (!(computedProps.value as Record<string, any>[])?.length) return <Blank />

      return (
        <Space direction="vertical">
          {(computedProps.value as Record<string, any>[]).map((value, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: use index as key
            <Description
              key={index}
              items={computedProps.item.object || []}
              dataSource={value}
              column={1}
            />
          ))}
        </Space>
      )
    default:
      return (computedProps.value as any) || null
  }
}

DescriptionItemContent.displayName = 'DescriptionItemContent'

/**
 * Render an Ant Design description list from FaasJS item metadata.
 *
 * The component can render a local `dataSource` directly or resolve one through `faasData`, and
 * it applies the same item type normalization helpers used by the form and table components.
 *
 * @template T - Data record shape rendered by the component.
 * @param {DescriptionProps<T>} props - Description props including items, data source, and optional Faas data config.
 * @throws {Error} When an entry in `extendTypes` omits both `children` and `render`.
 *
 * @example
 * ```tsx
 * import { Description } from '@faasjs/ant-design'
 *
 * export function Detail() {
 *   return (
 *     <Description
 *       title="Title"
 *       items={[
 *         {
 *           id: 'id',
 *           title: 'Title',
 *           type: 'string',
 *         },
 *       ]}
 *       dataSource={{ id: 'value' }}
 *     />
 *   )
 * }
 * ```
 */
export function Description<T extends Record<string, any> = any>(props: DescriptionProps<T>) {
  const { faasData, dataSource, renderTitle, extendTypes, ...descriptionProps } = props

  if (faasData && !dataSource)
    return (
      <FaasDataWrapper<T>
        render={({ data }) => (
          <Description
            {...descriptionProps}
            dataSource={data as T}
            {...(renderTitle ? { renderTitle } : {})}
            {...(extendTypes ? { extendTypes } : {})}
          />
        )}
        {...faasData}
      />
    )

  return (
    <Descriptions
      {...descriptionProps}
      title={
        typeof renderTitle === 'function' ? renderTitle(dataSource as T) : descriptionProps.title
      }
      items={descriptionProps.items
        .filter(
          (item) =>
            item && shouldRenderSceneItem(item, 'description') && (!item.if || item.if(dataSource)),
        )
        .map((item) => ({
          ...item,
          key: item.id,
          label: item.title ?? idToTitle(item.id),
          children: (
            <DescriptionItemContent
              item={item}
              value={dataSource ? (dataSource as Record<string, any>)[item.id] : null}
              {...(dataSource ? { values: dataSource } : {})}
              {...(extendTypes ? { extendTypes } : {})}
            />
          ),
        }))}
    />
  )
}

Description.displayName = 'Description'
