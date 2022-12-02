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
  DatePicker,
  DatePickerProps,
  TimePicker,
  TimePickerProps,
  FormInstance
} from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { FaasItemProps, transferOptions } from './data'
import type { RuleObject, ValidatorRule } from 'rc-field-form/lib/interface'
import {
  ReactNode, useEffect, useState
} from 'react'
import { upperFirst } from 'lodash-es'
import { BaseItemProps, BaseOption } from '.'
import { ConfigProviderProps, useConfigContext } from './Config'

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

type DateProps = {
  type: 'date'
  input?: DatePickerProps
}

type TimeProps = {
  type: 'time'
  input?: TimePickerProps
}

type ObjectProps = {
  type: 'object'
  object: FormItemProps[]
}

type ObjectListProps = {
  type: 'object[]'
  object: (FormItemProps & {
    /** default is 6 */
    col?: number
  })[]
  maxCount?: number
}

type OptionsProps = {
  options?: BaseOption[]
  type?: 'string' | 'string[]' | 'number' | 'number[]'
  input?: SelectProps<any>
}

type FormItemInputProps = (StringProps | StringListProps |
NumberProps | NumberListProps |
BooleanProps | OptionsProps | DateProps | TimeProps |
ObjectProps | ObjectListProps) & {
  disabled?: boolean
  required?: boolean
}

export type ExtendFormTypeProps = {
  children?: ReactNode
}

export type ExtendTypes = {
  [type: string]: ExtendFormTypeProps
}

export type ExtendFormItemProps = BaseItemProps & AntdFormItemProps

export type FormItemProps<T = any> = {
  children?: ReactNode
  render?: (value?: T) => ReactNode | JSX.Element
  rules?: RuleObject[]
  label?: string | false
  extendTypes?: ExtendTypes
  /** trigger when current item's value changed */
  onValueChange?: (value: T, values: any, form: FormInstance) => void
  /** trigger when any item's value changed */
  if?: (values: Record<string, any>) => boolean;
} & FormItemInputProps & FaasItemProps & Omit<AntdFormItemProps<T>, 'children'>

function processProps (propsCopy: FormItemProps, config: ConfigProviderProps['common']) {
  if (!propsCopy.title) propsCopy.title = upperFirst(propsCopy.id)
  if (!propsCopy.label && propsCopy.label !== false) propsCopy.label = propsCopy.title
  if (!propsCopy.name) propsCopy.name = propsCopy.id
  if (!propsCopy.type) propsCopy.type = 'string'
  if (!propsCopy.rules) propsCopy.rules = []
  if (propsCopy.required) {
    if (propsCopy.type.endsWith('[]'))
      propsCopy.rules.push({
        required: true,
        validator: async (_, values) => {
          if (!values || values.length < 1)
            return Promise.reject(Error(`${propsCopy.label || propsCopy.title} ${config.required}`))
        }
      })
    else
      propsCopy.rules.push({
        required: true,
        message: `${propsCopy.label || propsCopy.title} ${config.required}`
      })
  }
  if (!(propsCopy as OptionsProps).input) (propsCopy as OptionsProps).input = {}
  if ((propsCopy as OptionsProps).options)
    (propsCopy as OptionsProps).input.options = transferOptions(propsCopy.options)

  switch (propsCopy.type) {
    case 'boolean':
      propsCopy.valuePropName = 'checked'
      break
    case 'object':
      if (!Array.isArray(propsCopy.name))
        propsCopy.name = [propsCopy.name]
      for (const sub of propsCopy.object) {
        if (!(sub as FormItemProps).name)
          (sub as FormItemProps).name = propsCopy.name.concat(sub.id)
        processProps(sub, config)
      }
      break
  }

  return propsCopy
}

/**
 * FormItem, can be used without Form.
 *
 * ```ts
 * // use inline type
 * <FormItem type='string' id='name' />
 *
 * // use custom type
 * <FormItem id='password'>
 *   <Input.Password />
 * </>
 * ```
 */
export function FormItem<T = any> (props: FormItemProps<T>) {
  const [computedProps, setComputedProps] = useState<FormItemProps<T>>()
  const [extendTypes, setExtendTypes] = useState<ExtendTypes>()
  const { common } = useConfigContext()
  const [hidden, setHidden] = useState(props.hidden || false)

  useEffect(() => {
    const propsCopy = { ...props }

    if (propsCopy.extendTypes) {
      setExtendTypes(propsCopy.extendTypes)
      delete propsCopy.extendTypes
    }

    if (propsCopy.if) {
      const condition = propsCopy.if

      propsCopy.shouldUpdate = (_, cur) => {
        const show = condition(cur)
        setHidden(!show)
        return show
      }

      delete propsCopy.if
    }

    setComputedProps(processProps(propsCopy, common))
  }, [props])

  if (!computedProps) return null

  if (hidden) return <AntdForm.Item
    { ...computedProps }
    noStyle
    rules={ [] }
  >
    <Input hidden />
  </AntdForm.Item>

  if (extendTypes && extendTypes[computedProps.type])
    return <AntdForm.Item { ...computedProps }>
      { extendTypes[computedProps.type].children }
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
                {!computedProps.input?.disabled &&
                (!computedProps.rules.find(r => r.required) || field.key > 0) &&
                <Button
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
            {!computedProps.input?.disabled && (!(computedProps as StringListProps).maxCount ||
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
                {!computedProps.input?.disabled &&
                  (!computedProps.rules.find(r => r.required) || field.key > 0) &&
                  <Button
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
            {!computedProps.input?.disabled && (!(computedProps as NumberListProps).maxCount ||
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
    case 'date':
      return <AntdForm.Item { ...computedProps }>
        <DatePicker { ...computedProps.input } />
      </AntdForm.Item>
    case 'time':
      return <AntdForm.Item { ...computedProps }>
        <TimePicker { ...computedProps.input } />
      </AntdForm.Item>
    case 'object':
      return <>{computedProps.label && <div className='ant-form-item-label'>
        <label className={ computedProps.rules?.find((r: RuleObject) => r.required) && 'ant-form-item-required' }>{computedProps.label}</label>
      </div>}{computedProps.object.map(o => <FormItem
        key={ o.id }
        { ...o }
      />)}</>
    case 'object[]':
      return <AntdForm.List
        name={ computedProps.name }
        rules={ computedProps.rules as ValidatorRule[] }>
        {(fields, { add, remove }, { errors }) => <>
          {fields.map(field => <AntdForm.Item
            key={ field.key }
            style={ { marginBottom: 0 } }>
            <div className='ant-form-item-label'>
              <label>{computedProps.label} {field.name + 1}
                {!computedProps.disabled &&
                  (!computedProps.rules.find(r => r.required) || field.key > 0) &&
                  <Button
                    danger
                    type='link'
                    onClick={ () => remove(field.name) }
                  >{common.delete}</Button>}</label>
            </div>
            <Row gutter={ 24 }>
              {computedProps.object.map(o => <Col
                key={ o.id }
                span={ o.col || 24 }
              >
                <FormItem
                  { ...o }
                  name={ [field.name, o.id] }
                />
              </Col>)}
            </Row>
          </AntdForm.Item>)}
          <AntdForm.Item>
            {!computedProps.disabled && (!(computedProps as ObjectListProps).maxCount ||
              (computedProps as ObjectListProps).maxCount > fields.length) &&
              <Button
                type='dashed'
                block
                onClick={ () => add() }
                icon={ <PlusOutlined /> }
              >
                {common.add} {computedProps.label}
              </Button>}
            <AntdForm.ErrorList errors={ errors } />
          </AntdForm.Item>
        </>}
      </AntdForm.List>
    default:
      return null
  }
}
