import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Descriptions, DescriptionsProps } from 'antd'
import { upperFirst } from 'lodash'
import {
  cloneElement, useEffect, useState
} from 'react'
import { BaseItemType } from '.'
import { FaasItemProps } from './data'

export type ExtendDescriptionTypeProps = {
  children?: JSX.Element | null
  render?: (value: any, values: any) => JSX.Element | string | number | boolean | null
}

export type ExtendDescriptionItemProps = BaseItemType

export type DescriptionItemProps<T = any> = {
  children?: JSX.Element
  render?: (value: T, values: any) => JSX.Element | string | number | boolean | null
} & FaasItemProps

export type DescriptionProps<T = any, ExtendItemProps = any> = {
  items: (DescriptionItemProps | ExtendItemProps)[]
  dataSource: T
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

    setComputedProps(propsCopy)
  }, [props])

  if (!computedProps || typeof computedProps.value === 'undefined' || computedProps.value === null)
    return null

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

  switch (computedProps.item.type) {
    case 'string[]':
      return (computedProps.value as unknown as string[]).join(', ')
    case 'number':
      return computedProps.value
    case 'number[]':
      return (computedProps.value as unknown as number[]).join(', ')
    case 'boolean':
      return computedProps.value ? <CheckOutlined style={ { marginTop: '4px' } } /> : <CloseOutlined style={ { marginTop: '4px' } } />
    default:
      return computedProps.value
  }
}

export function Description (props: DescriptionProps) {
  return <Descriptions { ...props }>{
    props.items.map(item => <Descriptions.Item
      key={ item.id }
      label={ item.title || upperFirst(item.id) }>
      <DescriptionItemContent
        item={ item }
        value={ props.dataSource[item.id] }
        values={ props.dataSource }
        extendTypes={ props.extendTypes }
      />
    </Descriptions.Item>)
  }</Descriptions>
}
