import { Descriptions, type DescriptionsProps, Space } from 'antd'
import { type JSX, type ReactNode } from 'react'

import { Blank } from '../Blank'
import {
  type BaseItemProps,
  cloneUnionFaasItemElement,
  type FaasItemProps,
  idToTitle,
  renderDisplayValue,
  transferOptions,
  transferValue,
  type UnionFaasItemElement,
  type UnionFaasItemRender,
} from '../data'
import { FaasDataWrapper, type FaasDataWrapperProps } from '../FaasDataWrapper'

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
  const { item, value: rawValue, values, extendTypes } = props
  const type = item.type ?? 'string'
  const options = item.options?.length ? transferOptions(item.options) : undefined
  const value = transferValue(type, rawValue)

  if (
    item.descriptionChildren === null ||
    item.children === null ||
    item.descriptionRender === null ||
    item.render === null
  )
    return null

  const children = item.descriptionChildren || item.children
  if (children)
    return cloneUnionFaasItemElement(children, {
      scene: 'description',
      value,
      values,
      index: 0,
    })

  const render = item.descriptionRender || item.render
  if (render) return <>{render(value, values, 0, 'description')}</>

  if (extendTypes?.[type]) {
    const extendType = extendTypes[type]
    if (extendType.children)
      return cloneUnionFaasItemElement(extendType.children, {
        scene: 'description',
        value,
        values,
      })
    if (extendType.render) return <>{extendType.render(value, values, 0, 'description')}</>
    throw Error(`${type} requires children or render`)
  }

  if (type === 'object') {
    if (!value) return <Blank />
    return <Description items={item.object || []} dataSource={value as any} column={1} />
  }

  if (type === 'object[]') {
    if (!(value as Record<string, any>[])?.length) return <Blank />
    return (
      <Space direction="vertical">
        {(value as Record<string, any>[]).map((v, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Nested description items do not carry stable ids, but their order is preserved.
          <Description key={index} items={item.object || []} dataSource={v} column={1} />
        ))}
      </Space>
    )
  }

  return <>{renderDisplayValue(type, value, options)}</>
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

  if (faasData && !dataSource) {
    const faasDataProps: FaasDataWrapperProps<T> = {
      action: faasData.action as FaasDataWrapperProps<T>['action'],
      render: ({ data }) => (
        <Description
          {...descriptionProps}
          dataSource={data as T}
          {...(renderTitle ? { renderTitle } : {})}
          {...(extendTypes ? { extendTypes } : {})}
        />
      ),
    }

    if (faasData.baseUrl !== undefined) faasDataProps.baseUrl = faasData.baseUrl
    if (faasData.data !== undefined)
      faasDataProps.data = faasData.data as NonNullable<FaasDataWrapperProps<T>['data']>
    if (faasData.fallback !== undefined) faasDataProps.fallback = faasData.fallback
    if (faasData.onDataChange !== undefined)
      faasDataProps.onDataChange = (args) => faasData.onDataChange?.(args)
    if (faasData.params !== undefined)
      faasDataProps.params = faasData.params as NonNullable<FaasDataWrapperProps<T>['params']>
    if (faasData.ref !== undefined)
      faasDataProps.ref = faasData.ref as NonNullable<FaasDataWrapperProps<T>['ref']>
    if (faasData.setData !== undefined)
      faasDataProps.setData = faasData.setData as NonNullable<FaasDataWrapperProps<T>['setData']>

    return <FaasDataWrapper<T> {...faasDataProps} />
  }

  return (
    <Descriptions
      {...descriptionProps}
      title={
        typeof renderTitle === 'function' ? renderTitle(dataSource as T) : descriptionProps.title
      }
      items={descriptionProps.items
        .filter(
          (item) =>
            item &&
            !(
              item.descriptionChildren === null ||
              item.children === null ||
              item.descriptionRender === null ||
              item.render === null
            ) &&
            (!item.if || item.if(dataSource)),
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
