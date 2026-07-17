import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useEqualMemo } from '@faasjs/react'
import type { ValidatorRule } from '@rc-component/form/lib/interface'
import {
  Form as AntdForm,
  Button,
  Col,
  DatePicker,
  type DatePickerProps,
  Input,
  InputNumber,
  type InputNumberProps,
  type InputProps,
  Radio,
  type RadioProps,
  Row,
  Select,
  type SelectProps,
  Switch,
  type SwitchProps,
} from 'antd'
import type { RuleObject } from 'antd/es/form'
import { cloneDeep } from 'lodash-es'
import { useEffect, useState } from 'react'

import { type ResolvedTheme, useConfigContext } from '../Config'
import { cloneUnionFaasItemElement, idToTitle, transferOptions } from '../data'
import type { BaseOption } from '../data/types'
import type { FormItemProps } from './types'

type OptionsProps = {
  options: BaseOption[]
  type?: 'string' | 'string[]' | 'number' | 'number[]'
  input?: SelectProps<any>
}

function isOptionsProps(item: any): item is OptionsProps {
  return item && Array.isArray(item.options)
}

function processProps(propsCopy: FormItemProps, config: ResolvedTheme['common']): FormItemProps {
  propsCopy.title = propsCopy.title ?? idToTitle(propsCopy.id)
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
        },
      })
    else
      propsCopy.rules.push({
        required: true,
        message: `${propsCopy.label || propsCopy.title} ${config.required}`,
      })
  }
  if (!propsCopy.input) propsCopy.input = {}
  if (isOptionsProps(propsCopy)) propsCopy.input.options = transferOptions(propsCopy.options)

  switch (propsCopy.type) {
    case 'boolean':
      propsCopy.valuePropName = 'checked'
      break
    case 'object':
      if (!Array.isArray(propsCopy.name)) propsCopy.name = [propsCopy.name]
      for (const sub of propsCopy.object || []) {
        if (!sub.name) sub.name = propsCopy.name.concat(sub.id)
        processProps(sub, config)
      }
      break
  }

  return propsCopy
}

function createComputedProps<T>(
  props: FormItemProps<T>,
  config: ResolvedTheme['common'],
  hidden: boolean,
  setConditionalHidden: (hidden: boolean) => void,
): FormItemProps<T> {
  const propsCopy = cloneDeep(props) as FormItemProps<T>

  delete propsCopy.extendTypes

  if (propsCopy.if) {
    const condition = propsCopy.if
    const originShouldUpdate = propsCopy.shouldUpdate

    propsCopy.shouldUpdate = (prev, cur) => {
      const show = condition(cur as Record<string, any>)
      const shouldUpdate = hidden !== show

      setConditionalHidden(!show)

      const origin = originShouldUpdate
        ? typeof originShouldUpdate === 'boolean'
          ? originShouldUpdate
          : originShouldUpdate(prev, cur, {})
        : true

      return shouldUpdate || origin
    }

    delete propsCopy.if
    delete propsCopy.hidden
  }

  return processProps(propsCopy, config)
}

/**
 * Render a FaasJS-aware Ant Design form field or nested field group.
 *
 * The component derives default labels from `id`, applies required validation messages from the
 * active theme, supports surface-specific union renderers, and can render nested `object` or
 * `object[]` field structures.
 *
 * @template T - Value type rendered or edited by the form item.
 * @param {FormItemProps<T>} props - Form item props including field metadata, rules, and custom renderers.
 *
 * @example
 * ```tsx
 * import { FormItem } from '@faasjs/ant-design'
 * import { Input } from 'antd'
 *
 * export function AccountFields() {
 *   return (
 *     <>
 *       <FormItem id="name" type="string" />
 *       <FormItem id="password">
 *         <Input.Password />
 *       </FormItem>
 *     </>
 *   )
 * }
 * ```
 */
export function FormItem<T = any>(props: FormItemProps<T>) {
  const { theme } = useConfigContext()
  const [hidden, setHidden] = useState(props.hidden || false)

  useEffect(() => {
    setHidden(Boolean(props.hidden))
  }, [props.hidden])

  const computedProps = useEqualMemo(
    () => createComputedProps(props, theme.common, hidden, setHidden),
    [hidden, props, theme.common],
  )
  const extendTypes = props.extendTypes

  const itemType = computedProps.type ?? 'string'

  if (hidden)
    return (
      <AntdForm.Item {...computedProps} id={computedProps.id.toString()} noStyle rules={[]}>
        <Input type="hidden" hidden />
      </AntdForm.Item>
    )

  if (
    computedProps.formChildren === null ||
    computedProps.children === null ||
    computedProps.formRender === null ||
    computedProps.render === null
  )
    return null

  const children = computedProps.formChildren || computedProps.children
  const renderFormItem = (inputElement: React.ReactNode) => (
    <AntdForm.Item {...computedProps} id={computedProps.id.toString()}>
      {inputElement}
    </AntdForm.Item>
  )

  if (children) return renderFormItem(cloneUnionFaasItemElement(children, { scene: 'form' }))

  const render = computedProps.formRender || computedProps.render

  if (render)
    return renderFormItem(render(undefined as unknown as T, Object.create(null), 0, 'form'))

  const extendType = extendTypes?.[itemType]

  if (extendType?.children)
    return renderFormItem(
      cloneUnionFaasItemElement(extendType.children, {
        scene: 'form',
      }),
    )

  const renderSingleOptionsInput = (item: OptionsProps) =>
    item.options.length > 10 ? (
      <Select {...(item.input as SelectProps)} />
    ) : (
      <Radio.Group {...(item.input as RadioProps)} />
    )

  const renderMultipleOptionsInput = (item: OptionsProps) => (
    <Select mode="multiple" {...(item.input as SelectProps)} />
  )

  const renderInputNumber = () => (
    <InputNumber style={{ width: '100%' }} {...(computedProps.input as InputNumberProps)} />
  )

  const renderSwitch = () => <Switch {...(computedProps.input as SwitchProps)} />

  const renderDatePicker = () => <DatePicker {...(computedProps.input as DatePickerProps)} />

  const renderTimePicker = () => (
    <DatePicker {...{ ...(computedProps.input as DatePickerProps), showTime: true }} />
  )

  const renderFormItemList = (inputElement: React.ReactNode) => (
    <AntdForm.List
      name={computedProps.name as [string]}
      rules={computedProps.rules as ValidatorRule[]}
    >
      {(fields, { add, remove }, { errors }) => (
        <>
          {computedProps.label && (
            <div className="ant-form-item-label">
              <label
                className={
                  (computedProps.rules || []).find((r) => r.required) && 'ant-form-item-required'
                }
              >
                {computedProps.label}
              </label>
            </div>
          )}
          {fields.map((field) => {
            const { key, ...fieldProps } = field
            return (
              <AntdForm.Item key={key} id={key.toString()}>
                <Row gutter={24} style={{ flexFlow: 'row nowrap' }}>
                  <Col span={23}>
                    <AntdForm.Item {...fieldProps} noStyle>
                      {inputElement}
                    </AntdForm.Item>
                  </Col>
                  <Col span={1}>
                    {!computedProps.input?.disabled &&
                      (!(computedProps.rules || []).find((r) => r.required) || key > 0) && (
                        <Button
                          danger
                          type="link"
                          style={{ float: 'right' }}
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(field.name)}
                        />
                      )}
                  </Col>
                </Row>
              </AntdForm.Item>
            )
          })}
          <AntdForm.Item>
            {!computedProps.input?.disabled &&
              (!computedProps.maxCount || computedProps.maxCount > fields.length) && (
                <Button type="dashed" block onClick={() => add()} icon={<PlusOutlined />} />
              )}
            {computedProps.extra && (
              <div className="ant-form-item-extra">{computedProps.extra}</div>
            )}
            <AntdForm.ErrorList errors={errors} />
          </AntdForm.Item>
        </>
      )}
    </AntdForm.List>
  )

  const renderInputList = () =>
    renderFormItemList(<Input {...(computedProps.input as InputProps)} />)

  const renderInputNumberList = () => renderFormItemList(renderInputNumber())

  switch (itemType) {
    case 'string':
      return renderFormItem(
        isOptionsProps(computedProps) ? (
          renderSingleOptionsInput(computedProps)
        ) : (
          <Input {...(computedProps.input as InputProps)} />
        ),
      )
    case 'string[]':
      return isOptionsProps(computedProps)
        ? renderFormItem(renderMultipleOptionsInput(computedProps))
        : renderInputList()
    case 'number':
      return renderFormItem(
        isOptionsProps(computedProps)
          ? renderSingleOptionsInput(computedProps)
          : renderInputNumber(),
      )
    case 'number[]':
      return isOptionsProps(computedProps)
        ? renderFormItem(renderMultipleOptionsInput(computedProps))
        : renderInputNumberList()
    case 'boolean':
      return renderFormItem(renderSwitch())
    case 'date':
      return renderFormItem(renderDatePicker())
    case 'time':
      return renderFormItem(renderTimePicker())
    case 'object': {
      const objectItems = computedProps.object || []

      return (
        <>
          {computedProps.label && (
            <div className="ant-form-item-label">
              <label
                className={
                  computedProps.rules?.find((r: RuleObject) => r.required) &&
                  'ant-form-item-required'
                }
              >
                {computedProps.label}
              </label>
            </div>
          )}
          {objectItems.map((o) => (
            <FormItem key={o.id} {...o} />
          ))}
        </>
      )
    }
    case 'object[]':
      return (
        <AntdForm.List
          name={computedProps.name as [string]}
          rules={computedProps.rules as ValidatorRule[]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field) => (
                <AntdForm.Item
                  key={field.key}
                  id={field.key.toString()}
                  style={{ marginBottom: 0 }}
                >
                  <div className="ant-form-item-label">
                    <label>
                      {computedProps.label} {field.name + 1}
                      {!computedProps.disabled &&
                        (!(computedProps.rules || []).find((r) => r.required) || field.key > 0) && (
                          <Button danger type="link" onClick={() => remove(field.name)}>
                            {theme.common.delete}
                          </Button>
                        )}
                    </label>
                  </div>
                  <Row gutter={24}>
                    {(computedProps.object || []).map((o) => (
                      <Col key={o.id} span={o.col || 24}>
                        <FormItem {...o} name={[field.name, o.id]} />
                      </Col>
                    ))}
                  </Row>
                </AntdForm.Item>
              ))}
              <AntdForm.Item>
                {!computedProps.disabled &&
                  (!computedProps.maxCount || computedProps.maxCount > fields.length) && (
                    <Button type="dashed" block onClick={() => add()} icon={<PlusOutlined />}>
                      {theme.common.add} {computedProps.label}
                    </Button>
                  )}
                {computedProps.extra && (
                  <div className="ant-form-item-extra">{computedProps.extra}</div>
                )}
                <AntdForm.ErrorList errors={errors} />
              </AntdForm.Item>
            </>
          )}
        </AntdForm.List>
      )
    default:
      return null
  }
}

FormItem.useStatus = AntdForm.Item.useStatus

export type { ExtendFormItemProps, ExtendFormTypeProps, ExtendTypes, FormItemProps } from './types'
