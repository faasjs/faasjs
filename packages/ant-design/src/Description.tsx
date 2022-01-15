import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Descriptions, DescriptionsProps } from 'antd'
import { upperFirst } from 'lodash'
import {
  cloneElement, useEffect, useState
} from 'react'
import { BaseItemType } from '.'
import { FaasItemProps } from './data'
import { FaasDataWrapper } from './FaasWrapper'

export type ExtendDescriptionTypeProps = {
  children?: JSX.Element | null
  render?: (value: any, values: any) => JSX.Element | string | number | boolean | null
}

export type ExtendDescriptionItemProps = BaseItemType

export type DescriptionItemProps<T = any> = {
  options?: {
    label: string
    value?: T
  }[]
  children?: JSX.Element
  render?: (value: T, values: any) => JSX.Element | string | number | boolean | null
} & FaasItemProps

export type DescriptionProps<T = any, ExtendItemProps = any> = {
  items: (DescriptionItemProps | ExtendItemProps)[]
  dataSource?: T
  faasData?: {
    action: string
    params?: Record<string, any>
  }
  extendTypes?: {
    [key: string]: ExtendDescriptionTypeProps
  }
} & DescriptionsProps

type DescriptionItemContentProps<T = any> = {
  item: DescriptionItemProps
  value: T
  values?: any
  extendTypes?: {
    [key: string]: ExtendDescriptionTypeProps
  }
}

function DescriptionItemContent<T = any> (props: DescriptionItemContentProps<T>) {
  const [computedProps, setComputedProps] = useState<DescriptionItemContentProps<T>>()

  useEffect(() => {
    const propsCopy = { ...props }
    if (!propsCopy.item.title) propsCopy.item.title = upperFirst(propsCopy.item.id)
    if (!propsCopy.item.type) propsCopy.item.type = 'string'

    if (props.item.options && typeof props.value !== 'undefined' && props.value !== null) {
      if (props.item.type.endsWith('[]'))
        propsCopy.value = (props.value as unknown as any[]).map((v: any) => props.item.options
          .find(option => option.value === v)?.label as unknown as T
        || v) as unknown as T
      else
        propsCopy.value = props.item.options
          .find(option => option.value === props.value)?.label as unknown as T
        || props.value
    }

    setComputedProps(propsCopy)
  }, [props])

  if (!computedProps) return null

  if (computedProps.extendTypes && computedProps.extendTypes[computedProps.item.type])
    if (computedProps.extendTypes[computedProps.item.type].children)
      return cloneElement(
        computedProps.extendTypes[computedProps.item.type].children,
        {
          value: computedProps.value,
          values: computedProps.values
        }
      )
    else if (computedProps.extendTypes[computedProps.item.type].render)
      return computedProps.extendTypes[computedProps.item.type].render(computedProps.value, computedProps.values)
    else
      throw Error(computedProps.item.type + ' requires children or render')

  if (computedProps.item.children)
    return cloneElement(computedProps.item.children, { value: computedProps.value })

  if (computedProps.item.render)
    return computedProps.item.render(computedProps.value, computedProps.values)

  if (typeof computedProps.value === 'undefined' || computedProps.value === null) return null

  switch (computedProps.item.type) {
    case 'string[]':
      return (computedProps.value as unknown as string[]).join(', ')
    case 'number':
      return computedProps.value
    case 'number[]':
      return (computedProps.value as unknown as number[]).join(', ')
    case 'boolean':
      return computedProps.value ? <CheckOutlined style={ {
        marginTop: '4px',
        color: '#52c41a'
      } } /> : <CloseOutlined style={ {
        marginTop: '4px',
        color: '#ff4d4f'
      } } />
    default:
      return computedProps.value
  }
}

export function Description (props: DescriptionProps) {
  return <FaasDataWrapper
    dataSource={ props.dataSource }
    faasData={ props.faasData }
    render={ ({ data }) => <Descriptions { ...props }>{
      props.items.map(item => <Descriptions.Item
        key={ item.id }
        label={ item.title || upperFirst(item.id) }>
        <DescriptionItemContent
          item={ item }
          value={ data[item.id] }
          values={ data }
          extendTypes={ props.extendTypes }
        />
      </Descriptions.Item>)
    }</Descriptions> }
  />
}
