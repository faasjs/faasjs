import {
  Button,
  Row,
  Col,
  Form as AntdForm,
  FormItemProps as AntdFormItemProps,
  Input,
  InputNumber,
  Switch,
  InputProps,
  InputNumberProps,
  SwitchProps,
  Select,
  SelectProps,
} from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { FaasItemProps, transferOptions } from './data'
import type { RuleObject, ValidatorRule } from 'rc-field-form/lib/interface'
import { useEffect, useState } from 'react'
import { upperFirst } from 'lodash'
import { BaseItemProps, BaseOption } from '.'

type StringProps = {
  type?: 'string'
  input?: InputProps
}

type StringListProps = {
  type: 'string[]'
  input?: InputProps
  maxCount?: number
}

type NumberProps = {
  type: 'number'
  input?: InputNumberProps
}

type NumberListProps = {
  type: 'number[]'
  input?: InputNumberProps
  maxCount?: number
}

type BooleanProps = {
  type: 'boolean'
  input?: SwitchProps
}

type OptionsProps = {
  options?: BaseOption[]
  type?: 'string' | 'string[]' | 'number' | 'number[]'
  input?: SelectProps<any>
}

type FormItemInputProps<T = any> = StringProps | StringListProps |
NumberProps | NumberListProps |
BooleanProps | OptionsProps

export type ExtendFormTypeProps = {
  children?: JSX.Element | null
}

export type ExtendFormItemProps = BaseItemProps & AntdFormItemProps

export type FormItemProps<T = any> = {
  children?: JSX.Element | null
  render?: () => JSX.Element | null
  rules?: RuleObject[]
  label?: string | false
  extendTypes?: {
    [type: string]: ExtendFormTypeProps
  }
} & FormItemInputProps<T> & FaasItemProps & AntdFormItemProps<T>

export function FormItem<T = any> (props: FormItemProps<T>) {
  const [computedProps, setComputedProps] = useState<FormItemProps<T>>()

  useEffect(() => {
    const propsCopy = { ...props }
    if (!propsCopy.title) propsCopy.title = upperFirst(propsCopy.id)
    if (!propsCopy.label && props.label !== false) propsCopy.label = propsCopy.title
    if (!propsCopy.name) propsCopy.name = propsCopy.id
    if (!propsCopy.type) propsCopy.type = 'string'
    if (!propsCopy.rules) propsCopy.rules = []
    if (propsCopy.required) {
      if (propsCopy.type.endsWith('[]'))
        propsCopy.rules.push({
          required: true,
          validator: async (_, values) => {
            if (!values || values.length < 1)
              return Promise.reject(Error(`${propsCopy.label || propsCopy.title} is required`))
          }
        })
      else
        propsCopy.rules.push({
          required: true,
          message: `${propsCopy.label || propsCopy.title} is required`
        })
    }
    if (!propsCopy.input) propsCopy.input = {}
    if ((propsCopy as OptionsProps).options)
      (propsCopy as OptionsProps).input.options = transferOptions(propsCopy.options)

    switch (propsCopy.type) {
      case 'boolean':
        propsCopy.valuePropName = 'checked'
        break
    }

    setComputedProps(propsCopy)
  }, [props])

  if (!computedProps) return null

  if (computedProps.extendTypes && computedProps.extendTypes[computedProps.type])
    return <AntdForm.Item { ...computedProps }>
      { computedProps.extendTypes[computedProps.type].children }
    </AntdForm.Item>

  if (computedProps.children)
    return <AntdForm.Item { ...computedProps }>
      {computedProps.children }
    </AntdForm.Item>

  if (computedProps.render)
    return <AntdForm.Item { ...computedProps }>
      { computedProps.render() }
    </AntdForm.Item>

  switch (computedProps.type) {
    case 'string':
      return <AntdForm.Item { ...computedProps }>
        {(computedProps as OptionsProps).options ?
          <Select { ...computedProps.input as SelectProps } /> :
          <Input { ...computedProps.input as InputProps } />}
      </AntdForm.Item>
    case 'string[]':
      if ((computedProps as OptionsProps).options)
        return <AntdForm.Item { ...computedProps }>
          <Select
            mode='multiple'
            { ...computedProps.input as SelectProps } />
        </AntdForm.Item>

      return <AntdForm.List
        name={ computedProps.name }
        rules={ computedProps.rules as ValidatorRule[] }>
        {(fields, { add, remove }, { errors }) => <>
          {computedProps.label && <div className='ant-form-item-label'>
            <label className={ computedProps.rules.find(r => r.required) && 'ant-form-item-required' }>{computedProps.label}</label>
          </div>}
          {fields.map(field => <AntdForm.Item key={ field.key }>
            <Row
              gutter={ 24 }
              style={ { flexFlow: 'row nowrap' } }
            >
              <Col span={ 23 }>
                <AntdForm.Item
                  { ...field }
                  noStyle
                >
                  <Input { ...computedProps.input as InputProps } />
                </AntdForm.Item>
              </Col>
              <Col span={ 1 }>
                {(!computedProps.rules.find(r => r.required) || field.key > 0) && <Button
                  danger
                  type='link'
                  style={ { float: 'right' } }
                  icon={ <MinusCircleOutlined /> }
                  onClick={ () => remove(field.name) }
                />}
              </Col>
            </Row>
          </AntdForm.Item>)}
          <AntdForm.Item>
            {(!(computedProps as StringListProps).maxCount ||
              (computedProps as StringListProps).maxCount > fields.length) &&
              <Button
                type='dashed'
                block
                onClick={ () => add() }
                icon={ <PlusOutlined /> }
              >
              </Button>}
            <AntdForm.ErrorList errors={ errors } />
          </AntdForm.Item>
        </>}
      </AntdForm.List>
    case 'number':
      return <AntdForm.Item { ...computedProps }>
        {(computedProps as OptionsProps).options ?
          <Select { ...computedProps.input as SelectProps } /> :
          <InputNumber
            style={ { width: '100%' } }
            { ...computedProps.input as InputNumberProps } />}
      </AntdForm.Item>
    case 'number[]':
      if ((computedProps as OptionsProps).options)
        return <AntdForm.Item { ...computedProps }>
          <Select
            mode='multiple'
            { ...computedProps.input as SelectProps } />
        </AntdForm.Item>

      return <AntdForm.List
        name={ computedProps.name }
        rules={ computedProps.rules as ValidatorRule[] }>
        {(fields, { add, remove }, { errors }) => <>
          {computedProps.label && <div className='ant-form-item-label'>
            <label className={ computedProps.rules?.find((r: RuleObject) => r.required) && 'ant-form-item-required' }>{computedProps.label}</label>
          </div>}
          {fields.map(field => <AntdForm.Item key={ field.key }>
            <Row
              gutter={ 24 }
              style={ { flexFlow: 'row nowrap' } }
            >
              <Col span={ 23 }>
                <AntdForm.Item
                  { ...field }
                  noStyle
                >
                  <InputNumber
                    style={ { width: '100%' } }
                    { ...computedProps.input as InputNumberProps } />
                </AntdForm.Item>
              </Col>
              <Col span={ 1 }>
                {(!computedProps.rules.find(r => r.required) || field.key > 0) && <Button
                  danger
                  type='link'
                  style={ { float: 'right' } }
                  icon={ <MinusCircleOutlined /> }
                  onClick={ () => remove(field.name) }
                />}
              </Col>
            </Row>
          </AntdForm.Item>)}
          <AntdForm.Item>
            {(!(computedProps as NumberListProps).maxCount ||
              (computedProps as NumberListProps).maxCount > fields.length) &&
              <Button
                type='dashed'
                block
                onClick={ () => add() }
                icon={ <PlusOutlined /> }
              >
              </Button>}
            <AntdForm.ErrorList errors={ errors } />
          </AntdForm.Item>
        </>}
      </AntdForm.List>
    case 'boolean':
      return <AntdForm.Item { ...computedProps }>
        <Switch { ...computedProps.input } />
      </AntdForm.Item>
    default:
      return null
  }
}
