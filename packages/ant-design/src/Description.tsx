import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import {
  Descriptions, DescriptionsProps, Skeleton, Space
} from 'antd'
import { isFunction, upperFirst } from 'lodash'
import {
  cloneElement, ReactNode, useEffect, useState
} from 'react'
import dayjs from 'dayjs'
import { BaseItemProps } from '.'
import { FaasItemProps, transferOptions } from './data'
import { FaasDataWrapper, FaasDataWrapperProps } from '@faasjs/react'
import { Blank } from './Blank'

export type ExtendDescriptionTypeProps = {
  children?: JSX.Element | null
  render?: (value: any, values: any) => ReactNode | JSX.Element
}

export type ExtendDescriptionItemProps = BaseItemProps

export type DescriptionItemProps<T = any> = {
  children?: JSX.Element
  render?: (value: T, values: any) => ReactNode | JSX.Element
} & FaasItemProps & {
  object?: DescriptionItemProps[]
}

export type DescriptionProps<T = any, ExtendItemProps = any> = {
  renderTitle?: ((values: T) => ReactNode | JSX.Element)
  items: (DescriptionItemProps | ExtendItemProps)[]
  extendTypes?: {
    [key: string]: ExtendDescriptionTypeProps
  }
  dataSource?: T
  faasData?: FaasDataWrapperProps<T>
} & DescriptionsProps

type DescriptionItemContentProps<T = any> = {
  item: DescriptionItemProps
  value: T
  values?: any
  extendTypes?: {
    [key: string]: ExtendDescriptionTypeProps
  }
}

function DescriptionItemContent<T = any> (props: DescriptionItemContentProps<T>): JSX.Element {
  const [computedProps, setComputedProps] = useState<DescriptionItemContentProps<T>>()

  useEffect(() => {
    const propsCopy = { ...props }

    if (!propsCopy.item.title) propsCopy.item.title = upperFirst(propsCopy.item.id)
    if (!propsCopy.item.type) propsCopy.item.type = 'string'
    if (propsCopy.item.options?.length) {
      propsCopy.item.options = transferOptions(propsCopy.item.options)
    }

    if (propsCopy.item.options && typeof propsCopy.value !== 'undefined' && propsCopy.value !== null) {
      if (propsCopy.item.type.endsWith('[]'))
        propsCopy.value = (propsCopy.value as unknown as any[]).map((v: any) => (propsCopy.item.options as {
          label: string
          value: any
        }[])
          .find(option => option.value === v)?.label
        || v) as unknown as T
      else if ([
        'string',
        'number',
        'boolean'
      ].includes(propsCopy.item.type))
        propsCopy.value = (props.item.options as {
          label: string
          value: any
        }[])
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
      return <>{computedProps.extendTypes[computedProps.item.type].render(computedProps.value, computedProps.values)}</>
    else
      throw Error(computedProps.item.type + ' requires children or render')

  if (computedProps.item.children)
    return cloneElement(computedProps.item.children, { value: computedProps.value })

  if (computedProps.item.render)
    return <>{computedProps.item.render(computedProps.value, computedProps.values)}</>

  if (typeof computedProps.value === 'undefined' || computedProps.value === null)
    return <Blank />

  switch (computedProps.item.type) {
    case 'string[]':
      return <>{(computedProps.value as string[]).join(', ')}</>
    case 'number':
      return computedProps.value as any || null
    case 'number[]':
      return <>{(computedProps.value as number[]).join(', ')}</>
    case 'boolean':
      return computedProps.value ? <CheckOutlined style={ {
        marginTop: '4px',
        color: '#52c41a'
      } } /> : <CloseOutlined style={ {
        marginTop: '4px',
        color: '#ff4d4f'
      } } />
    case 'time':
      // check unix timestamp
      return <>
        {(typeof computedProps.value === 'number' && computedProps.value.toString().length === 10) ?
          dayjs.unix(computedProps.value as number).format('YYYY-MM-DD HH:mm:ss')
          :
          dayjs(computedProps.value as any).format('YYYY-MM-DD HH:mm:ss')}
      </>
    case 'date':
      // check unix timestamp
      return <>
        {(typeof computedProps.value === 'number' && computedProps.value.toString().length === 10) ?
          dayjs.unix(computedProps.value as number).format('YYYY-MM-DD')
          :
          dayjs(computedProps.value as any).format('YYYY-MM-DD')}
      </>
    case 'object':
      return <Description
        items={ computedProps.item.object }
        dataSource={ computedProps.value }
      />
    case 'object[]':
      if (!(computedProps.value as Record<string, any>[])?.length) return <Blank />

      return <Space direction="vertical">{
        (computedProps.value as Record<string, any>[])
          .map((value, index) => <Description
            key={ index }
            items={ computedProps.item.object }
            dataSource={ value }
          />)
      }</Space>
    default:
      return computedProps.value as any || null
  }
}

export function Description<T = any> (props: DescriptionProps<T>) {
  if (!props.faasData)
    return <Descriptions
      { ...props }
      title={ isFunction(props.renderTitle) ? props.renderTitle(props.dataSource) : props.title }
    >
      {
        props.items.map(item => <Descriptions.Item
          key={ item.id }
          label={ item.title || upperFirst(item.id) }>
          <DescriptionItemContent
            item={ item }
            value={ (props.dataSource as Record<string, any>)[item.id] }
            values={ props.dataSource }
            extendTypes={ props.extendTypes }
          />
        </Descriptions.Item>)
      }
    </Descriptions>

  return <FaasDataWrapper<T>
    fallback={ props.faasData.fallback || <Skeleton active /> }
    render={ ({ data }) => {
      return <Descriptions
        { ...props }
        title={ isFunction(props.renderTitle) ? props.renderTitle(data) : props.title }
      >
        {
          props.items.map(item => <Descriptions.Item
            key={ item.id }
            label={ item.title || upperFirst(item.id) }>
            <DescriptionItemContent
              item={ item }
              value={ (data as Record<string, any>)[item.id] }
              values={ data }
              extendTypes={ props.extendTypes }
            />
          </Descriptions.Item>)
        }
      </Descriptions>
    } }
    { ...props.faasData }
  />
}
