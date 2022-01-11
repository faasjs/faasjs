import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Descriptions, DescriptionsProps } from 'antd'
import { upperFirst } from 'lodash'
import {
  cloneElement, useEffect, useState
} from 'react'
import { FaasItemProps } from './data'

export type DescriptionItemProps = FaasItemProps & {
  children?: JSX.Element
}

export type DescriptionProps<T = any> = {
  items: DescriptionItemProps[]
  dataSource: T
} & DescriptionsProps

type DescriptionItemContentProps<T = any> = {
  item: DescriptionItemProps
  value: T
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

  if (computedProps.item.children) {
    return cloneElement(computedProps.item.children, { value: computedProps.value })
  }

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
      />
    </Descriptions.Item>)
  }</Descriptions>
}
