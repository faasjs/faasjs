import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { useEqualEffect } from '@faasjs/react'
import type { ValidatorRule } from '@rc-component/form/lib/interface'
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
import type { RuleObject } from 'antd/es/form'
import { useState } from 'react'

import { type ResolvedTheme, useConfigContext } from './Config'
import type { BaseItemProps, FaasItemType, UnionFaasItemElement, UnionFaasItemRender } from './data'
import { type BaseOption } from './data'
import { normalizeSceneItem, renderSceneNode, shouldRenderSceneItem } from './itemHelpers'

type OptionsProps = {
  options: BaseOption[]
  type?: 'string' | 'string[]' | 'number' | 'number[]'
  input?: SelectProps<any>
}

/**
 * Custom renderer registration for a form item type.
 *
 * @template T - Value type rendered by the custom form item type.
 */
export type ExtendFormTypeProps<T = any> = {
  /** Custom element used to render the registered form item type. */
  children?: UnionFaasItemElement<T>
}

/**
 * Map of custom form item type registrations.
 */
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

/**
 * Item definition used by the `FormItem` and `Form` components.
 *
 * @template T - Value type rendered or edited by the form item.
 */
export interface FormItemProps<T = any>
  extends BaseItemProps, Omit<AntdFormItemProps<T>, 'id' | 'children' | 'render'> {
  /**
   * Built-in FaasJS field type used to choose the default Ant Design input.
   *
   * @default 'string'
   */
  type?: FaasItemType
  /** Input props forwarded to the generated Ant Design control. */
  input?: InputTypeMap<T>[FaasItemType]
  /** Maximum item count allowed for list-style field types. */
  maxCount?: number
  /** Nested field definitions used by `object` and `object[]` item types. */
  object?: FormItemProps[]
  /** Whether the generated field is disabled. */
  disabled?: boolean
  /** Whether the generated field adds a required validation rule. */
  required?: boolean
  /** Grid span used by surrounding object-list layouts. */
  col?: number
  /** Generic custom field renderer or element. */
  children?: UnionFaasItemElement<T> | null
  /** Form-specific custom field renderer or element. */
  formChildren?: UnionFaasItemElement<T> | null
  /** Generic custom render callback. */
  render?: UnionFaasItemRender<T> | null
  /** Form-specific custom render callback. */
  formRender?: UnionFaasItemRender<T> | null
  /** Validation rules forwarded to Ant Design `Form.Item`. */
  rules?: RuleObject[]
  /** Label override, or `false` to hide the label completely. */
  label?: string | false
  /** Custom form item type renderers keyed by type name. */
  extendTypes?: ExtendTypes
  /** Callback invoked when this field's value changes. */
  onValueChange?: (value: T, values: any, form: FormInstance) => void
  /** Predicate used to show or hide the item from the current form values. */
  if?: (values: Record<string, any>) => boolean
}

/**
 * Item shape used to extend `Form` with custom type names.
 *
 * @example
 * ```tsx
 * import { Form, type ExtendFormItemProps, type FormProps } from '@faasjs/ant-design'
 * import { Input } from 'antd'
 *
 * interface ExtendTypes extends ExtendFormItemProps {
 *   type: 'password'
 * }
 *
 * function ExtendForm(props: FormProps<any, ExtendTypes>) {
 *   return (
 *     <Form
 *       {...props}
 *       extendTypes={{ password: { children: <Input.Password /> } }}
 *     />
 *   )
 * }
 *
 * export function Page() {
 *   return (
 *     <ExtendForm
 *       items={[
 *         {
 *           id: 'password',
 *           type: 'password',
 *         },
 *       ]}
 *     />
 *   )
 * }
 * ```
 */
export interface ExtendFormItemProps extends Omit<FormItemProps, 'type'> {
  type?: string
}

function isOptionsProps(item: any): item is OptionsProps {
  return item && Array.isArray(item.options)
}

function processProps(propsCopy: FormItemProps, config: ResolvedTheme['common']): FormItemProps {
  const item = normalizeSceneItem(propsCopy)

  if (!item.label && item.label !== false) item.label = item.title
  if (!item.name) item.name = item.id
  if (!item.rules) item.rules = []
  if (item.required) {
    if (item.type.endsWith('[]'))
      item.rules.push({
        required: true,
        validator: async (_, values) => {
          if (!values || values.length < 1)
            return Promise.reject(Error(`${item.label || item.title} ${config.required}`))
        },
      })
    else
      item.rules.push({
        required: true,
        message: `${item.label || item.title} ${config.required}`,
      })
  }
  if (!item.input) item.input = {}
  if (isOptionsProps(item)) (item.input as SelectProps<any>).options = item.options as any

  switch (item.type) {
    case 'boolean':
      item.valuePropName = 'checked'
      break
    case 'object':
      if (!Array.isArray(item.name)) item.name = [item.name]
      for (const sub of item.object || []) {
        if (!sub.name) sub.name = item.name.concat(sub.id)
        processProps(sub, config)
      }
      break
  }

  return item
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
  const [computedProps, setComputedProps] = useState<FormItemProps<T>>()
  const [extendTypes, setExtendTypes] = useState<ExtendTypes>()
  const { theme } = useConfigContext()
  const [hidden, setHidden] = useState(props.hidden || false)

  useEqualEffect(() => {
    const { extendTypes, ...propsCopy } = { ...props }

    if (extendTypes) {
      setExtendTypes(extendTypes)
    }

    if (propsCopy.if) {
      const condition = propsCopy.if
      const originShouldUpdate = propsCopy.shouldUpdate

      propsCopy.shouldUpdate = (prev, cur) => {
        const show = condition(cur as Record<string, any>)
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
  }, [hidden, props, theme.common])

  if (!computedProps) return null

  const itemType = computedProps.type ?? 'string'

  if (hidden)
    return (
      <AntdForm.Item {...computedProps} id={computedProps.id.toString()} noStyle rules={[]}>
        <Input type="hidden" hidden />
      </AntdForm.Item>
    )

  if (!shouldRenderSceneItem(computedProps, 'form')) return null

  const extendType = extendTypes?.[itemType]
  const customSceneNode = renderSceneNode({
    scene: 'form',
    item: computedProps as any,
    value: undefined as unknown as T,
    values: Object.create(null),
    index: 0,
    extendType: extendType as any,
  })

  if (customSceneNode.matched)
    return (
      <AntdForm.Item {...computedProps} id={computedProps.id.toString()}>
        {customSceneNode.node}
      </AntdForm.Item>
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

  switch (itemType) {
    case 'string':
      if (isOptionsProps(computedProps))
        return (
          <AntdForm.Item {...computedProps} id={computedProps.id.toString()}>
            {computedProps.options.length > 10 ? (
              <Select {...(computedProps.input as SelectProps)} />
            ) : (
              <Radio.Group {...(computedProps.input as RadioProps)} />
            )}
          </AntdForm.Item>
        )

      return (
        <AntdForm.Item {...computedProps} id={computedProps.id.toString()}>
          <Input {...(computedProps.input as InputProps)} />
        </AntdForm.Item>
      )
    case 'string[]':
      if (isOptionsProps(computedProps))
        return (
          <AntdForm.Item {...computedProps} id={computedProps.id.toString()}>
            <Select mode="multiple" {...(computedProps.input as SelectProps)} />
          </AntdForm.Item>
        )

      return renderFormItemList(<Input {...(computedProps.input as InputProps)} />)
    case 'number':
      if (isOptionsProps(computedProps))
        return (
          <AntdForm.Item {...computedProps} id={computedProps.id.toString()}>
            {computedProps.options.length > 10 ? (
              <Select {...(computedProps.input as SelectProps)} />
            ) : (
              <Radio.Group {...(computedProps.input as RadioProps)} />
            )}
          </AntdForm.Item>
        )

      return (
        <AntdForm.Item {...computedProps} id={computedProps.id.toString()}>
          <InputNumber style={{ width: '100%' }} {...(computedProps.input as InputNumberProps)} />
        </AntdForm.Item>
      )
    case 'number[]':
      if (isOptionsProps(computedProps))
        return (
          <AntdForm.Item {...computedProps} id={computedProps.id.toString()}>
            <Select mode="multiple" {...(computedProps.input as SelectProps)} />
          </AntdForm.Item>
        )

      return renderFormItemList(
        <InputNumber style={{ width: '100%' }} {...(computedProps.input as InputNumberProps)} />,
      )
    case 'boolean':
      return (
        <AntdForm.Item {...computedProps} id={computedProps.id.toString()}>
          <Switch {...(computedProps.input as SwitchProps)} />
        </AntdForm.Item>
      )
    case 'date':
      return (
        <AntdForm.Item {...computedProps} id={computedProps.id.toString()}>
          <DatePicker {...(computedProps.input as DatePickerProps)} />
        </AntdForm.Item>
      )
    case 'time':
      return (
        <AntdForm.Item {...computedProps} id={computedProps.id.toString()}>
          <DatePicker {...{ ...(computedProps.input as DatePickerProps), showTime: true }} />
        </AntdForm.Item>
      )
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
