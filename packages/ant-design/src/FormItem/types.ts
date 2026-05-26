import type {
  FormItemProps as AntdFormItemProps,
  DatePickerProps,
  FormInstance,
  InputNumberProps,
  InputProps,
  RadioProps,
  SelectProps,
  SwitchProps,
} from 'antd'
import type { RuleObject } from 'antd/es/form'

import type {
  BaseExtendTypeProps,
  BaseItemProps,
  FaasItemType,
  UnionFaasItemElement,
  UnionFaasItemRender,
} from '../data/types'

/**
 * Type-level extension payload for custom form item types.
 *
 * @template T - Value type rendered or edited by the form item.
 */
export type ExtendFormTypeProps<T = any> = BaseExtendTypeProps<T>

/**
 * Dictionary of custom form item type renderers keyed by item type name.
 */
export type ExtendTypes = {
  [type: string]: ExtendFormTypeProps
}

/**
 * Map from {@link FaasItemType} to the Ant Design input component props accepted by {@link FormItem}.
 *
 * @template T - Value type rendered or edited by the form item.
 */
export type InputTypeMap<T> = {
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
 * Props for the {@link FormItem} component.
 *
 * Each field can render as a single form control, a list of controls, or a nested object/object-list
 * group of child form items.
 *
 * @template T - Value type rendered or edited by the form item.
 */
export interface FormItemProps<T = any>
  extends BaseItemProps, Omit<AntdFormItemProps<T>, 'id' | 'children' | 'render'> {
  /** Item type that determines which Ant Design control is rendered. */
  type?: FaasItemType
  /** Props forwarded to the Ant Design input component used for this field. */
  input?: InputTypeMap<T>[FaasItemType]
  /** Maximum number of entries allowed in a list item. */
  maxCount?: number
  /** Nested item definitions used by `object` and `object[]` item types. */
  object?: FormItemProps[]
  /** Whether the field is disabled. */
  disabled?: boolean
  /** Whether the field is required. When `true`, a required validation rule is appended. */
  required?: boolean
  /** Number of columns taken by this field in the Ant Design grid. */
  col?: number
  /** Generic custom element rendered when no form-specific child overrides it. */
  children?: UnionFaasItemElement<T> | null
  /** Form-specific custom element. */
  formChildren?: UnionFaasItemElement<T> | null
  /** Generic custom render callback. */
  render?: UnionFaasItemRender<T> | null
  /** Form-specific custom render callback. */
  formRender?: UnionFaasItemRender<T> | null
  /** Validation rules appended to the field. */
  rules?: RuleObject[]
  /** Field label text, or `false` to hide the label. */
  label?: string | false
  /** Custom type renderers keyed by item type. */
  extendTypes?: ExtendTypes
  /** Called when the field value changes. */
  onValueChange?: (value: T, values: any, form: FormInstance) => void
  /** Conditional visibility predicate. When `false`, the field is hidden and rendered as a hidden input. */
  if?: (values: Record<string, any>) => boolean
}

/**
 * Extensible form item props that accept any string `type`.
 */
export interface ExtendFormItemProps extends Omit<FormItemProps, 'type'> {
  type?: string
}
