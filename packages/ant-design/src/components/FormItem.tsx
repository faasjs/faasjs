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
import { FaasItemProps } from './data'
import type { RuleObject, ValidatorRule } from 'rc-field-form/lib/interface'
import {
  ReactNode, useEffect, useState
} from 'react'
import { upperFirst } from 'lodash'

type StringProps = {
  type?: 'string' | 'string[]'
  input?: InputProps
}

type NumberProps = {
  type?: 'number' | 'number[]'
  input?: InputNumberProps
}

type BooleanProps = {
  type?: 'boolean'
  input?: SwitchProps
}

type OptionType<T = any> = {
  label: ReactNode
  value?: T
  disabled?: boolean
  children?: Omit<OptionType<T>, 'children'>[]
}

type OptionsProps<T = any> = {
  options?: OptionType<T>[]
  type?: 'string' | 'string[]' | 'number' | 'number[]'
  input?: SelectProps<any>
}

type FormItemInputProps<T = any> = StringProps | NumberProps | BooleanProps | OptionsProps<T>

export type FormItemProps<T = any> = {
  children?: JSX.Element
  rules?: RuleObject[]
  label?: string | false
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
    if (propsCopy.required) propsCopy.rules.push({
      required: true,
      message: `${propsCopy.label} is required`
    })
    if (!propsCopy.input) propsCopy.input = {}
    if ((propsCopy as OptionsProps).options) {
      (propsCopy as OptionsProps).input.options = (propsCopy as OptionsProps).options
    }

    switch (propsCopy.type) {
      case 'boolean':
        propsCopy.valuePropName = 'checked'
        break
    }

    setComputedProps(propsCopy)
  }, [props])

  if (!computedProps) return null

  if (computedProps.children)
    return <AntdForm.Item { ...computedProps }>
      {computedProps.children }
    </AntdForm.Item>

  switch (computedProps.type) {
    case 'string':
      return <AntdForm.Item { ...computedProps }>
        {(computedProps as OptionsProps).options ?
          <Select {...computedProps.input as SelectProps} /> :
          <Input { ...computedProps.input as InputProps } />}
      </AntdForm.Item>
    case 'string[]':
      if ((computedProps as OptionsProps).options)
        return <AntdForm.Item { ...computedProps }>
          <Select mode='multiple' {...computedProps.input as SelectProps} />
        </AntdForm.Item>

      return <AntdForm.List
        name={ computedProps.name }
        rules={ computedProps.rules as ValidatorRule[] }>
        {(fields, { add, remove }) => <>
          {computedProps.label && <div className='ant-form-item-label'>
            <label className={ computedProps.rules.find(r => r.required) && 'ant-form-item-required' }>{computedProps.label}</label>
          </div>}
          {fields.map(field => <AntdForm.Item key={ field.key }>
            <Row gutter={ 16 }>
              <Col span={ 23 }>
                <AntdForm.Item
                  { ...field }
                  noStyle
                >
                  <Input { ...computedProps.input as InputProps } />
                </AntdForm.Item>
              </Col>
              <Col span={ 1 }>
                {!computedProps.rules.find(r => r.required) && <Button
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
            <Button
              type='dashed'
              block
              onClick={ () => add() }
              icon={ <PlusOutlined /> }
            >
            </Button>
          </AntdForm.Item>
        </>}
      </AntdForm.List>
    case 'number':
      return <AntdForm.Item { ...computedProps }>
        {(computedProps as OptionsProps).options ?
          <Select {...computedProps.input as SelectProps} /> :
          <InputNumber style={ { width: '100%' } } { ...computedProps.input as InputNumberProps } />}
      </AntdForm.Item>
    case 'number[]':
      if ((computedProps as OptionsProps).options)
        return <AntdForm.Item { ...computedProps }>
          <Select mode='multiple' {...computedProps.input as SelectProps} />
        </AntdForm.Item>

      return <AntdForm.List
        name={ computedProps.name }
        rules={ computedProps.rules as ValidatorRule[] }>
        {(fields, { add, remove }) => <>
          {computedProps.label && <div className='ant-form-item-label'>
            <label className={ computedProps.rules?.find((r: RuleObject) => r.required) && 'ant-form-item-required' }>{computedProps.label}</label>
          </div>}
          {fields.map(field => <AntdForm.Item key={ field.key }>
            <Row gutter={ 16 }>
              <Col span={ 23 }>
                <AntdForm.Item
                  { ...field }
                  noStyle
                >
                  <InputNumber style={ { width: '100%' } } { ...computedProps.input as InputNumberProps } />
                </AntdForm.Item>
              </Col>
              <Col span={ 1 }>
                <Button
                  danger
                  type='link'
                  style={ { float: 'right' } }
                  icon={ <MinusCircleOutlined /> }
                  onClick={ () => remove(field.name) }
                />
              </Col>
            </Row>
          </AntdForm.Item>)}
          <AntdForm.Item>
            <Button
              type='dashed'
              block
              onClick={ () => add() }
              icon={ <PlusOutlined /> }
            >
            </Button>
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
