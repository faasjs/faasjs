import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { cloneElement, createElement, type FC, isValidElement, type ReactElement } from 'react'
import type { DescriptionItemProps } from './Description'
import type { FormItemProps } from './FormItem'
import type { TableItemProps } from './Table'

export type FaasItemType =
  | 'string'
  | 'string[]'
  | 'number'
  | 'number[]'
  | 'boolean'
  | 'date'
  | 'time'
  | 'object'
  | 'object[]'

/** FaasItemType's value type */
export type FaasItemTypeValue = {
  string: string
  'string[]': string[]
  number: number
  'number[]': number[]
  boolean: boolean
  date: Dayjs
  time: Dayjs
  object: any
  'object[]': any[]
}

export type BaseOption =
  | string
  | number
  | {
      label: string
      value?: any
    }

export interface BaseItemProps {
  id: string | number
  title?: string
  options?: BaseOption[]
}

export interface FaasItemProps extends BaseItemProps {
  /**
   * Support string, string[], number, number[], boolean, date, time, object, object[]
   * @default 'string'
   */
  type?: FaasItemType
}

/**
 * Converts an identifier string to a title case string.
 *
 * This function takes an identifier string with words separated by underscores,
 * capitalizes the first letter of each word, and joins them together without spaces.
 *
 * @param id - The identifier string to convert.
 * @returns The converted title case string.
 *
 * @example
 * ```typescript
 * idToTitle('example_id'); // returns 'ExampleId'
 * ```
 */
export function idToTitle(id: string | number): string {
  if (typeof id === 'number') return id.toString()

  const splitted = id
    .split(/(\s|_|-)/)
    .filter((word) => !/(\s|_|-)/.test(word))
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return splitted.charAt(0).toUpperCase() + splitted.slice(1)
}

/**
 * convert string[] or number[] to { label, value }[]
 */
export function transferOptions(options: BaseOption[]): {
  label: string
  value?: string | number
}[] {
  if (!options) return []

  return options.map((item: any) =>
    typeof item === 'object'
      ? item
      : {
          label: idToTitle(item.toString()),
          value: item,
        },
  )
}

export function transferValue(type: FaasItemType | null | undefined, value: any): any {
  if (!type) type = 'string'

  if (
    !type.endsWith('[]') &&
    (typeof value === 'undefined' ||
      value === null ||
      value === '' ||
      value === 'null' ||
      value === 'undefined')
  )
    return null

  if (type.endsWith('[]')) {
    if (!value) value = []

    if (typeof value === 'string') value = value.split(',').filter(Boolean)

    if (!Array.isArray(value)) value = [value]

    value = value.map((item: any) => transferValue(type.replace('[]', '') as FaasItemType, item))
  }

  switch (type) {
    case 'boolean':
      if (typeof value === 'string') value = value === 'true'
      break
    case 'number':
      if (typeof value === 'string') value = Number(value)
      break
    case 'date':
    case 'time':
      if (typeof value === 'number' && value.toString().length === 10) value = value * 1000

      if (!dayjs.isDayjs(value)) value = dayjs(value)
      break
  }

  return value
}

export type UnionScene = 'form' | 'description' | 'table'

export type UnionFaasItemInjection<Value = any, Values = any> = {
  scene?: UnionScene
  value?: Value
  values?: Values
  index?: number
}

/**
 * A type representing a function that renders a React node for a given item in a list.
 *
 * @param value - The value of the current item.
 * @param values - The entire list of values.
 * @param index - The index of the current item in the list.
 * @param scene {@link UnionScene} - The scene in which the rendering is taking place.
 *
 * @example
 * ```tsx
 * import { type UnionFaasItemRender, Form, Description, Table } from '@faasjs/ant-design'
 *
 * const nameReader: UnionFaasItemRender = (value, values, index, scene) => {
 *   switch (scene) {
 *     case 'form':
 *       return <input />
 *     case 'description':
 *     case 'table':
 *       return <span>{value}</span>
 *     default:
 *       return null
 *   }
 * }
 *
 * const items = [
 *   {
 *     id: 'name',
 *     render: nameReader,
 *   }
 * ]
 *
 * function App() {
 *   return <>
 *     <Form items={items} /> // Will render an input
 *     <Description items={items} dataSource={{ name: 'John' }} /> // Will render a span
 *     <Table items={items} dataSource={[{ name: 'John' }]} /> // Will render a span
 *   </>
 * }
 * ```
 */
export type UnionFaasItemRender<Value = any, Values = any> = (
  value: Value,
  values: Values,
  index: number,
  scene: UnionScene,
) => React.ReactNode

/**
 * Represents a React element that is used in the UnionFaasItem context.
 *
 * This type can either be a React element with the specified injection types or `null`.
 *
 * @example
 * ```tsx
 * import { type UnionFaasItemElement, Form, Description, Table } from '@faasjs/ant-design'
 *
 * const NameComponent: UnionFaasItemElement = ({ scene, value }) => {
 *   switch (scene) {
 *     switch (scene) {
 *     case 'form':
 *       return <input />
 *     case 'description':
 *     case 'table':
 *       return <span>{value}</span>
 *     default:
 *       return null
 *   }
 * }
 *
 * const items = [
 *   {
 *    id: 'name',
 *    children: NameComponent // both `NameComponent` and `<NameComponent />` is valid
 *   }
 * ]
 *
 * function App() {
 *   return <>
 *    <Form items={items} /> // Will render an input
 *    <Description items={items} dataSource={{ name: 'John' }} /> // Will render a span
 *    <Table items={items} dataSource={[{ name: 'John' }]} /> // Will render a span
 *  </>
 * }
 * ```
 */
export type UnionFaasItemElement<Value = any, Values = any> =
  | ReactElement<UnionFaasItemInjection<Value, Values>>
  | FC<UnionFaasItemInjection<Value, Values>>

/**
 * Interface representing the properties of a UnionFaas item.
 *
 * The UnionFaas item can be used in a form, description, or table.
 *
 * ### Render Priority Order
 *
 * 1. **Null Rendering** (Notice: it also doesn't render column in table and description)
 *    1. Returns `null` if specific children or render props are null:
 *        - `formChildren` / `descriptionChildren` / `tableChildren` / `formRender` / `descriptionRender` / `tableRender`
 *    2. Returns `null` if `children` or `render` prop is null
 * 2. **Children Rendering**
 *    1. First priority: Component-specific children
 *        - `formChildren` for Form
 *        - `descriptionChildren` for Description
 *        - `tableChildren` for Table
 *    2. Second priority: Generic `children` prop
 * 3. **Custom Render Functions**
 *    1. First priority: Component-specific render functions
 *        - `formRender` for Form
 *        - `descriptionRender` for Description
 *        - `tableRender` for Table
 *    2. Second priority: Generic `render` prop
 * 4. **Extended Types**
 *    - Renders based on registered extended type handlers
 * 5. **Default Rendering**
 *    - Renders primitive types (string, number, etc.)
 *    - Uses default formatting based on data type
 *
 * @example
 * ```tsx
 * import { type UnionFaasItemProps, Form, Table, Description } from '@faasjs/ant-design'
 *
 * const item: UnionFaasItemProps[] = [
 *   {
 *     id: 'id',
 *     formChildren: null, // Don't show in form, only in description and table
 *   },
 *   {
 *     id: 'name',
 *     required: true, // Required in form
 *   },
 *   {
 *     id: 'age',
 *     type: 'number', // Number type in form, description and table
 *     options: ['< 18', '>= 18'], // Options in form and table
 *   }
 * ]
 *
 * const data = {
 *   id: '1',
 *   name: 'John',
 *   age: '>= 18',
 * }
 *
 * function App() {
 *   return <>
 *     <Form items={item} /> // Use in form
 *     <Description items={item} dataSource={data} /> // Use in description
 *     <Table items={item} dataSource={[ data ]} /> // Use in table
 *   </>
 * }
 * ```
 */
export interface UnionFaasItemProps<Value = any, Values = any>
  extends FormItemProps, DescriptionItemProps, TableItemProps {
  children?: UnionFaasItemElement<Value, Values> | null
  render?: UnionFaasItemRender<Value, Values> | null
  object?: UnionFaasItemProps<Value, Values>[]
}

/**
 * Clone a UnionFaasItemElement with the given props.
 *
 * This function takes a UnionFaasItemElement and props, and returns a cloned element.
 * If the provided element is a valid React element, it clones it with the new props.
 * Otherwise, it creates a new element from the provided element and props.
 *
 * @param element - The UnionFaasItemElement to be cloned.
 * @param props - The props to be applied to the cloned element.
 * @returns The cloned element with the applied props.
 */
export function cloneUnionFaasItemElement(element: UnionFaasItemElement, props: any) {
  return cloneElement(isValidElement(element) ? element : createElement(element), props)
}
