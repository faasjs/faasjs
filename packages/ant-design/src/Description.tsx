import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Descriptions, type DescriptionsProps, Space } from 'antd'
import type { Dayjs } from 'dayjs'
import { type JSX, type ReactNode, useEffect, useState } from 'react'
import type { BaseItemProps } from '.'
import { Blank } from './Blank'
import {
  cloneUnionFaasItemElement,
  type FaasItemProps,
  idToTitle,
  transferOptions,
  transferValue,
  type UnionFaasItemElement,
  type UnionFaasItemRender,
} from './data'
import { FaasDataWrapper, type FaasDataWrapperProps } from './FaasDataWrapper'

export interface ExtendDescriptionTypeProps<T = any> {
  children?: UnionFaasItemElement<T>
  render?: UnionFaasItemRender<T>
}

export type ExtendDescriptionItemProps = BaseItemProps

export interface DescriptionItemProps<T = any> extends FaasItemProps {
  children?: UnionFaasItemElement<T> | null
  descriptionChildren?: UnionFaasItemElement<T> | null
  render?: UnionFaasItemRender<T> | null
  descriptionRender?: UnionFaasItemRender<T> | null
  if?: (values: Record<string, any>) => boolean
  object?: DescriptionItemProps<T>[]
}

export interface DescriptionProps<T = any, ExtendItemProps = any>
  extends Omit<DescriptionsProps, 'items'> {
  renderTitle?(values: T): ReactNode
  items: (DescriptionItemProps | ExtendItemProps)[]
  extendTypes?: {
    [key: string]: ExtendDescriptionTypeProps
  }
  dataSource?: T
  faasData?: FaasDataWrapperProps<T>
}

export interface DescriptionItemContentProps<T = any> {
  item: DescriptionItemProps
  value: T
  values?: any
  extendTypes?: {
    [key: string]: ExtendDescriptionTypeProps
  }
}

function DescriptionItemContent<T = any>(
  props: DescriptionItemContentProps<T>
): JSX.Element {
  const [computedProps, setComputedProps] =
    useState<DescriptionItemContentProps<T>>()

  useEffect(() => {
    const propsCopy = { ...props }

    propsCopy.item.title = propsCopy.item.title ?? idToTitle(propsCopy.item.id)
    if (!propsCopy.item.type) propsCopy.item.type = 'string'
    if (propsCopy.item.options?.length) {
      propsCopy.item.options = transferOptions(propsCopy.item.options)
    }

    propsCopy.value = transferValue(propsCopy.item.type, propsCopy.value)

    if (propsCopy.item.options && propsCopy.value !== null) {
      if (propsCopy.item.type.endsWith('[]'))
        propsCopy.value = (propsCopy.value as unknown as any[]).map(
          (v: any) =>
            (
              propsCopy.item.options as {
                label: string
                value: any
              }[]
            ).find(option => option.value === v)?.label || v
        ) as unknown as T
      else if (['string', 'number', 'boolean'].includes(propsCopy.item.type))
        propsCopy.value =
          ((
            props.item.options as {
              label: string
              value: any
            }[]
          ).find(option => option.value === props.value)
            ?.label as unknown as T) || props.value
    }

    setComputedProps(propsCopy)
  }, [props])

  if (!computedProps) return null

  if (
    computedProps.item.descriptionChildren === null ||
    computedProps.item.children === null ||
    computedProps.item.descriptionRender === null ||
    computedProps.item.render === null
  )
    return null

  const children =
    computedProps.item.descriptionChildren || computedProps.item.children
  if (children)
    return cloneUnionFaasItemElement(children, {
      scene: 'description',
      value: computedProps.value,
      values: computedProps.values,
      index: 0,
    })

  const render =
    computedProps.item.descriptionRender || computedProps.item.render

  if (render)
    return (
      <>{render(computedProps.value, computedProps.values, 0, 'description')}</>
    )

  if (computedProps.extendTypes?.[computedProps.item.type]) {
    if (computedProps.extendTypes[computedProps.item.type].children)
      return cloneUnionFaasItemElement(
        computedProps.extendTypes[computedProps.item.type].children,
        {
          scene: 'description',
          value: computedProps.value,
          values: computedProps.values,
        }
      )
    if (computedProps.extendTypes[computedProps.item.type].render)
      return (
        <>
          {computedProps.extendTypes[computedProps.item.type].render(
            computedProps.value,
            computedProps.values,
            0,
            'description'
          )}
        </>
      )
    throw Error(`${computedProps.item.type} requires children or render`)
  }

  if (
    computedProps.value === null ||
    (Array.isArray(computedProps.value) && !computedProps.value.length)
  )
    return <Blank />

  switch (computedProps.item.type) {
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
    case 'object':
      if (!computedProps.value) return <Blank />

      return (
        <Description
          items={computedProps.item.object}
          dataSource={computedProps.value}
          column={1}
        />
      )
    case 'object[]':
      if (!(computedProps.value as Record<string, any>[])?.length)
        return <Blank />

      return (
        <Space direction='vertical'>
          {(computedProps.value as Record<string, any>[]).map(
            (value, index) => (
              <Description
                // biome-ignore lint/suspicious/noArrayIndexKey: use index as key
                key={index}
                items={computedProps.item.object}
                dataSource={value}
                column={1}
              />
            )
          )}
        </Space>
      )
    default:
      return (computedProps.value as any) || null
  }
}

DescriptionItemContent.displayName = 'DescriptionItemContent'

/**
 * Description component
 *
 * - Based on [Ant Design Descriptions](https://ant.design/components/descriptions/).
 *
 * @example
 * ```tsx
 * import { Description } from '@faasjs/ant-design'
 *
 * <Description
 *   title="Title"
 *   items={[
 *     {
 *       id: 'id',
 *       title: 'Title',
 *       type: 'string',
 *     },
 *   ]}
 *   dataSource={{ id: 'value' }}
 * />
 * ```
 */
export function Description<T extends Record<string, any> = any>({
  faasData,
  dataSource,
  renderTitle,
  extendTypes,
  ...props
}: DescriptionProps<T>) {
  if (faasData && !dataSource)
    return (
      <FaasDataWrapper<T>
        render={({ data }) => (
          <Description
            {...props}
            dataSource={data as T}
            renderTitle={renderTitle}
            extendTypes={extendTypes}
          />
        )}
        {...faasData}
      />
    )

  return (
    <Descriptions
      {...props}
      title={
        typeof renderTitle === 'function'
          ? renderTitle(dataSource)
          : props.title
      }
      items={props.items
        .filter(
          item =>
            item &&
            !(
              item.descriptionChildren === null ||
              item.children === null ||
              item.descriptionRender === null ||
              item.render === null
            ) &&
            (!item.if || item.if(dataSource))
        )
        .map(item => ({
          ...item,
          key: item.id,
          label: item.title ?? idToTitle(item.id),
          children: (
            <DescriptionItemContent
              item={item}
              value={
                dataSource ? (dataSource as Record<string, any>)[item.id] : null
              }
              values={dataSource}
              extendTypes={extendTypes}
            />
          ),
        }))}
    />
  )
}

Description.displayName = 'Description'
