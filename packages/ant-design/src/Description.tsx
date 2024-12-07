import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Descriptions, type DescriptionsProps, Space } from 'antd'
import type { Dayjs } from 'dayjs'
import {
  type JSX,
  type ReactNode,
  cloneElement,
  useEffect,
  useState,
} from 'react'
import type { BaseItemProps } from '.'
import { Blank } from './Blank'
import { FaasDataWrapper, type FaasDataWrapperProps } from './FaasDataWrapper'
import {
  type FaasItemProps,
  type UnionFaasItemElement,
  type UnionFaasItemRender,
  transferOptions,
  transferValue,
  upperFirst,
} from './data'

export interface ExtendDescriptionTypeProps<T = any> {
  children?: UnionFaasItemElement<T>
  render?: UnionFaasItemRender<T>
}

export type ExtendDescriptionItemProps = BaseItemProps

export interface DescriptionItemProps<T = any> extends FaasItemProps {
  children?: UnionFaasItemElement<T>
  descriptionChildren?: UnionFaasItemElement<T>
  render?: UnionFaasItemRender<T>
  descriptionRender?: UnionFaasItemRender<T>
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

    if (!propsCopy.item.title)
      propsCopy.item.title = upperFirst(propsCopy.item.id)
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

  if (computedProps.extendTypes?.[computedProps.item.type]) {
    if (computedProps.extendTypes[computedProps.item.type].children)
      return cloneElement(
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

  if (computedProps.item.descriptionChildren === null) return null

  if (computedProps.item.descriptionChildren)
    return cloneElement(computedProps.item.descriptionChildren, {
      scene: 'description',
      value: computedProps.value,
      values: computedProps.values,
    })

  if (computedProps.item.children === null) return null

  if (computedProps.item.children)
    return cloneElement(computedProps.item.children, {
      scene: 'description',
      value: computedProps.value,
      values: computedProps.values,
    })

  if (computedProps.item.descriptionRender)
    return (
      <>
        {computedProps.item.descriptionRender(
          computedProps.value,
          computedProps.values,
          0,
          'description'
        )}
      </>
    )

  if (computedProps.item.render)
    return (
      <>
        {computedProps.item.render(
          computedProps.value,
          computedProps.values,
          0,
          'description'
        )}
      </>
    )

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
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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

DescriptionItemContent.whyDidYouRender = true

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
export function Description<T extends Record<string, any> = any>(
  props: DescriptionProps<T>
) {
  if (props.faasData && !props.dataSource)
    return (
      <FaasDataWrapper<T>
        render={({ data }) => <Description {...props} dataSource={data} />}
        {...props.faasData}
      />
    )

  return (
    <Descriptions
      {...props}
      title={
        typeof props.renderTitle === 'function'
          ? props.renderTitle(props.dataSource)
          : props.title
      }
      items={props.items
        .filter(item => item && (!item.if || item.if(props.dataSource)))
        .map(item => ({
          ...item,
          key: item.id,
          label: item.title || upperFirst(item.id),
          children: (
            <DescriptionItemContent
              item={item}
              value={
                props.dataSource
                  ? (props.dataSource as Record<string, any>)[item.id]
                  : null
              }
              values={props.dataSource}
              extendTypes={props.extendTypes}
            />
          ),
        }))}
    />
  )
}

Description.whyDidYouRender = true
