import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Form as AntdForm,
  type FormItemProps as AntdFormItemProps,
  Button,
  Col,
  DatePicker,
  type DatePickerProps,
  type FormInstance,
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
import type { RuleObject, ValidatorRule } from 'rc-field-form/lib/interface'
import { cloneElement, useEffect, useState } from 'react'
import { type ConfigProviderProps, useConfigContext } from './Config'
import type {
  BaseItemProps,
  FaasItemType,
  UnionFaasItemElement,
  UnionFaasItemRender,
} from './data'
import { type BaseOption, transferOptions, upperFirst } from './data'

type OptionsProps = {
  options: BaseOption[]
  type?: 'string' | 'string[]' | 'number' | 'number[]'
  input?: SelectProps<any>
}

export type ExtendFormTypeProps<T = any> = {
  children?: UnionFaasItemElement<T>
}

export type ExtendTypes = {
  [type: string]: ExtendFormTypeProps
}

type InputTypeMap<T> = {
  string: InputProps | SelectProps<T> | RadioProps
  'string[]': InputProps | SelectProps<T> | RadioProps
  number: InputNumberProps | SelectProps<T> | RadioProps
  'number[]': InputNumberProps | SelectProps<T> | RadioProps
  boolean: SwitchProps
  date: DatePickerProps
  time: DatePickerProps
  object: never
  'object[]': never
}

export interface FormItemProps<T = any>
  extends BaseItemProps,
  Omit<AntdFormItemProps<T>, 'id' | 'children' | 'render'> {
  type?: FaasItemType
  input?: InputTypeMap<T>[FaasItemType]
  maxCount?: number
  object?: FormItemProps[]
  disabled?: boolean
  required?: boolean
  col?: number
  children?: UnionFaasItemElement<T>
  formChildren?: UnionFaasItemElement<T>
  render?: UnionFaasItemRender<T>
  formRender?: UnionFaasItemRender<T>
  rules?: RuleObject[]
  label?: string | false
  extendTypes?: ExtendTypes
  /** trigger when current item's value changed */
  onValueChange?: (value: T, values: any, form: FormInstance) => void
  /** trigger when any item's value changed */
  if?: (values: Record<string, any>) => boolean
}

/**
 * Extend custom form item types.
 *
 * @example
 * ```ts
 * import type { ExtendFormItemProps, FormProps } from '@faasjs/ant-design'
 *
 * // define custom type
 * interface ExtendTypes extends ExtendFormItemProps {
 *   type: 'password'
 * }
 *
 * // extend form
 * function ExtendForm(props: FormProps<any, ExtendTypes>) {
 *   return (
 *     <Form
 *       {...props}
 *       extendTypes={{ password: { children: <Input.Password /> } }}
 *     />
 *   )
 * }
 *
 * // use custom type
 * <ExtendForm
 *   items={[
 *     {
 *       id: 'test',
 *       type: 'password',
 *     },
 *   ]}
 * />
 * ```
 */
export interface ExtendFormItemProps extends Omit<FormItemProps, 'type'> {
  type?: string
}

function isOptionsProps(item: any): item is OptionsProps {
  return item && Array.isArray(item.options)
}

function processProps(
  propsCopy: FormItemProps,
  config: ConfigProviderProps['theme']['common']
): FormItemProps {
  if (!propsCopy.title) propsCopy.title = upperFirst(propsCopy.id)
  if (!propsCopy.label && propsCopy.label !== false)
    propsCopy.label = propsCopy.title
  if (!propsCopy.name) propsCopy.name = propsCopy.id
  if (!propsCopy.type) propsCopy.type = 'string'
  if (!propsCopy.rules) propsCopy.rules = []
  if (propsCopy.required) {
    if (propsCopy.type.endsWith('[]'))
      propsCopy.rules.push({
        required: true,
        validator: async (_, values) => {
          if (!values || values.length < 1)
            return Promise.reject(
              Error(`${propsCopy.label || propsCopy.title} ${config.required}`)
            )
        },
      })
    else
      propsCopy.rules.push({
        required: true,
        message: `${propsCopy.label || propsCopy.title} ${config.required}`,
      })
  }
  if (!propsCopy.input) propsCopy.input = {}
  if (isOptionsProps(propsCopy))
    propsCopy.input.options = transferOptions(propsCopy.options)

  switch (propsCopy.type) {
    case 'boolean':
      propsCopy.valuePropName = 'checked'
      break
    case 'object':
      if (!Array.isArray(propsCopy.name)) propsCopy.name = [propsCopy.name]
      for (const sub of propsCopy.object) {
        if (!sub.name) sub.name = propsCopy.name.concat(sub.id)
        processProps(sub, config)
      }
      break
  }

  return propsCopy
}

/**
 * FormItem
 *
 * - Based on [Ant Design Form.Item](https://ant.design/components/form#formitem).
 * - Can be used without [Form](https://faasjs.com/doc/ant-design/#form).
 *
 * @example
 * ```tsx
 * // use inline type
 * <FormItem type='string' id='name' />
 *
 * // use custom type
 * <FormItem id='password'>
 *   <Input.Password />
 * </>
 * ```
 */
export function FormItem<T = any>(props: FormItemProps<T>) {
  const [computedProps, setComputedProps] = useState<FormItemProps<T>>()
  const [extendTypes, setExtendTypes] = useState<ExtendTypes>()
  const { theme } = useConfigContext()
  const [hidden, setHidden] = useState(props.hidden || false)

  useEffect(() => {
    const { extendTypes, ...propsCopy } = { ...props }

    if (extendTypes) {
      setExtendTypes(extendTypes)
    }

    if (propsCopy.if) {
      const condition = propsCopy.if
      const originShouldUpdate = propsCopy.shouldUpdate

      propsCopy.shouldUpdate = (prev, cur) => {
        const show = condition(cur)
        const shouldUpdate = hidden !== show

        setHidden(!show)

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

    setComputedProps(processProps(propsCopy, theme.common))
  }, [props])

  if (!computedProps) return null

  if (hidden)
    return (
      <AntdForm.Item {...computedProps} noStyle rules={[]}>
        <Input type='hidden' hidden />
      </AntdForm.Item>
    )

  if (extendTypes?.[computedProps.type])
    return (
      <AntdForm.Item {...computedProps}>
        {extendTypes[computedProps.type].children}
      </AntdForm.Item>
    )

  if (computedProps.formChildren === null) return null

  if (computedProps.formChildren)
    return (
      <AntdForm.Item {...computedProps}>
        {cloneElement(computedProps.formChildren, { scene: 'form' })}
      </AntdForm.Item>
    )

  if (computedProps.children === null) return null

  if (computedProps.children)
    return (
      <AntdForm.Item {...computedProps}>
        {cloneElement(computedProps.children, { scene: 'form' })}
      </AntdForm.Item>
    )

  if (computedProps.formRender)
    return (
      <AntdForm.Item {...computedProps}>
        {computedProps.formRender(null, null, 0, 'form')}
      </AntdForm.Item>
    )

  if (computedProps.render)
    return (
      <AntdForm.Item {...computedProps}>
        {computedProps.render(null, null, 0, 'form')}
      </AntdForm.Item>
    )

  switch (computedProps.type) {
    case 'string':
      if (isOptionsProps(computedProps))
        return (
          <AntdForm.Item {...computedProps}>
            {computedProps.options.length > 10 ? (
              <Select {...(computedProps.input as SelectProps)} />
            ) : (
              <Radio.Group {...(computedProps.input as RadioProps)} />
            )}
          </AntdForm.Item>
        )

      return (
        <AntdForm.Item {...computedProps}>
          <Input {...(computedProps.input as InputProps)} />
        </AntdForm.Item>
      )
    case 'string[]':
      if (isOptionsProps(computedProps))
        return (
          <AntdForm.Item {...computedProps}>
            <Select mode='multiple' {...(computedProps.input as SelectProps)} />
          </AntdForm.Item>
        )

      return (
        <AntdForm.List
          name={computedProps.name as [string]}
          rules={computedProps.rules as ValidatorRule[]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {computedProps.label && (
                <div className='ant-form-item-label'>
                  <label
                    className={
                      computedProps.rules.find(r => r.required) &&
                      'ant-form-item-required'
                    }
                  >
                    {computedProps.label}
                  </label>
                </div>
              )}
              {fields.map(field => (
                <AntdForm.Item key={field.key}>
                  <Row gutter={24} style={{ flexFlow: 'row nowrap' }}>
                    <Col span={23}>
                      <AntdForm.Item {...field} noStyle>
                        <Input {...(computedProps.input as InputProps)} />
                      </AntdForm.Item>
                    </Col>
                    <Col span={1}>
                      {!computedProps.input?.disabled &&
                        (!computedProps.rules.find(r => r.required) ||
                          field.key > 0) && (
                          <Button
                            danger
                            type='link'
                            style={{ float: 'right' }}
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(field.name)}
                          />
                        )}
                    </Col>
                  </Row>
                </AntdForm.Item>
              ))}
              <AntdForm.Item>
                {!computedProps.input?.disabled &&
                  (!computedProps.maxCount ||
                    computedProps.maxCount > fields.length) && (
                    <Button
                      type='dashed'
                      block
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    />
                  )}
                {computedProps.extra && (
                  <div className='ant-form-item-extra'>
                    {computedProps.extra}
                  </div>
                )}
                <AntdForm.ErrorList errors={errors} />
              </AntdForm.Item>
            </>
          )}
        </AntdForm.List>
      )
    case 'number':
      if ((computedProps as OptionsProps).options)
        return (
          <AntdForm.Item {...computedProps}>
            {computedProps.options.length > 10 ? (
              <Select {...(computedProps.input as SelectProps)} />
            ) : (
              <Radio.Group {...(computedProps.input as RadioProps)} />
            )}
          </AntdForm.Item>
        )

      return (
        <AntdForm.Item {...computedProps}>
          <InputNumber
            style={{ width: '100%' }}
            {...(computedProps.input as InputNumberProps)}
          />
        </AntdForm.Item>
      )
    case 'number[]':
      if ((computedProps as OptionsProps).options)
        return (
          <AntdForm.Item {...computedProps}>
            <Select mode='multiple' {...(computedProps.input as SelectProps)} />
          </AntdForm.Item>
        )

      return (
        <AntdForm.List
          name={computedProps.name as [string]}
          rules={computedProps.rules as ValidatorRule[]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {computedProps.label && (
                <div className='ant-form-item-label'>
                  <label
                    className={
                      computedProps.rules?.find(
                        (r: RuleObject) => r.required
                      ) && 'ant-form-item-required'
                    }
                  >
                    {computedProps.label}
                  </label>
                </div>
              )}
              {fields.map(field => (
                <AntdForm.Item key={field.key}>
                  <Row gutter={24} style={{ flexFlow: 'row nowrap' }}>
                    <Col span={23}>
                      <AntdForm.Item {...field} noStyle>
                        <InputNumber
                          style={{ width: '100%' }}
                          {...(computedProps.input as InputNumberProps)}
                        />
                      </AntdForm.Item>
                    </Col>
                    <Col span={1}>
                      {!computedProps.input?.disabled &&
                        (!computedProps.rules.find(r => r.required) ||
                          field.key > 0) && (
                          <Button
                            danger
                            type='link'
                            style={{ float: 'right' }}
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(field.name)}
                          />
                        )}
                    </Col>
                  </Row>
                </AntdForm.Item>
              ))}
              <AntdForm.Item>
                {!computedProps.input?.disabled &&
                  (!computedProps.maxCount ||
                    computedProps.maxCount > fields.length) && (
                    <Button
                      type='dashed'
                      block
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    />
                  )}
                {computedProps.extra && (
                  <div className='ant-form-item-extra'>
                    {computedProps.extra}
                  </div>
                )}
                <AntdForm.ErrorList errors={errors} />
              </AntdForm.Item>
            </>
          )}
        </AntdForm.List>
      )
    case 'boolean':
      return (
        <AntdForm.Item {...computedProps}>
          <Switch {...(computedProps.input as SwitchProps)} />
        </AntdForm.Item>
      )
    case 'date':
      return (
        <AntdForm.Item {...computedProps}>
          <DatePicker {...(computedProps.input as DatePickerProps)} />
        </AntdForm.Item>
      )
    case 'time':
      return (
        <AntdForm.Item {...computedProps}>
          <DatePicker
            {...{ ...(computedProps.input as DatePickerProps), showTime: true }}
          />
        </AntdForm.Item>
      )
    case 'object':
      return (
        <>
          {computedProps.label && (
            <div className='ant-form-item-label'>
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
          {computedProps.object.map(o => (
            <FormItem key={o.id} {...o} />
          ))}
        </>
      )
    case 'object[]':
      return (
        <AntdForm.List
          name={computedProps.name as [string]}
          rules={computedProps.rules as ValidatorRule[]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map(field => (
                <AntdForm.Item key={field.key} style={{ marginBottom: 0 }}>
                  <div className='ant-form-item-label'>
                    <label>
                      {computedProps.label} {field.name + 1}
                      {!computedProps.disabled &&
                        (!computedProps.rules.find(r => r.required) ||
                          field.key > 0) && (
                          <Button
                            danger
                            type='link'
                            onClick={() => remove(field.name)}
                          >
                            {theme.common.delete}
                          </Button>
                        )}
                    </label>
                  </div>
                  <Row gutter={24}>
                    {computedProps.object.map(o => (
                      <Col key={o.id} span={o.col || 24}>
                        <FormItem {...o} name={[field.name, o.id]} />
                      </Col>
                    ))}
                  </Row>
                </AntdForm.Item>
              ))}
              <AntdForm.Item>
                {!computedProps.disabled &&
                  (!computedProps.maxCount ||
                    computedProps.maxCount > fields.length) && (
                    <Button
                      type='dashed'
                      block
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      {theme.common.add} {computedProps.label}
                    </Button>
                  )}
                {computedProps.extra && (
                  <div className='ant-form-item-extra'>
                    {computedProps.extra}
                  </div>
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

FormItem.whyDidYouRender = true

FormItem.useStatus = AntdForm.Item.useStatus
