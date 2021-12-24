import {
  Button,
  Row,
  Col,
  Form as AntdForm,
  FormItemProps as AntdFormItemProps,
  Input,
  InputNumber,
  Switch,
} from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { FaasItemProps } from './data'
import type { RuleObject, ValidatorRule } from 'rc-field-form/lib/interface'
import { useEffect, useState } from 'react'
import { upperFirst } from 'lodash'

export type FormItemProps<T = any> = {
  children?: JSX.Element
  rules?: RuleObject[]
} & FaasItemProps & AntdFormItemProps<T>

export function FormItem<T> (props: FormItemProps<T>) {
  const [computedProps, setComputedProps] = useState<FormItemProps<T>>()

  useEffect(() => {
    const propsCopy = { ...props }
    if (!propsCopy.title) propsCopy.title = upperFirst(propsCopy.id)
    if (!propsCopy.label) propsCopy.label = propsCopy.title
    if (!propsCopy.name) propsCopy.name = propsCopy.id
    if (!propsCopy.type) propsCopy.type = 'string'
    if (!propsCopy.rules) propsCopy.rules = []

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
        <Input />
      </AntdForm.Item>
    case 'string[]':
      return <AntdForm.List
        name={ computedProps.name }
        rules={ computedProps.rules as ValidatorRule[] }>
        {(fields, { add, remove }) => <>
          <div
            className='ant-row ant-form-item ant-form-item-label'
            style={ { rowGap: '0px' } }>
            <label className={ computedProps.rules.find(r => r.required) && 'ant-form-item-required' }>{computedProps.label}</label>
          </div>
          {fields.map(field => <AntdForm.Item key={ field.key }>
            <Row gutter={ 16 }>
              <Col span={ 23 }>
                <AntdForm.Item
                  { ...field }
                  noStyle
                >
                  <Input />
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
        <InputNumber style={ { width: '100%' } } />
      </AntdForm.Item>
    case 'number[]':
      return <AntdForm.List
        name={ computedProps.name }
        rules={ computedProps.rules as ValidatorRule[] }>
        {(fields, { add, remove }) => <>
          <div
            className='ant-row ant-form-item ant-form-item-label'
            style={ { rowGap: '0px' } }>
            <label className={ computedProps.rules?.find((r: RuleObject) => r.required) && 'ant-form-item-required' }>{computedProps.label}</label>
          </div>
          {fields.map(field => <AntdForm.Item key={ field.key }>
            <Row gutter={ 16 }>
              <Col span={ 23 }>
                <AntdForm.Item
                  { ...field }
                  noStyle
                >
                  <InputNumber style={ { width: '100%' } } />
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
        <Switch />
      </AntdForm.Item>
    default:
      return null
  }
}
