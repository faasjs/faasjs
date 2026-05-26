import dayjs from 'dayjs'
import { cloneElement, createElement, isValidElement } from 'react'

import type { BaseOption, FaasItemType, UnionFaasItemElement } from './types'

/**
 * Derive a human-readable title from a raw identifier.
 *
 * Splits on whitespace, underscores, and hyphens, then capitalises each segment.
 *
 * @param id - Raw identifier.
 * @returns Title-cased string derived from the identifier.
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
 * Normalise raw option entries into a stable shape with `label` and `value`.
 *
 * String and number options receive a title-cased label derived from the raw value.
 *
 * @param options - Raw options accepted by form items, description items, and table columns.
 * @returns Normalised option objects.
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

/**
 * Coerce a raw value into the expected JavaScript type for a given {@link FaasItemType}.
 *
 * Falsy scalar values (including the strings `"null"` and `"undefined"`) are normalised to `null`.
 * Array-typed values are coerced element-by-element. Date/time values are parsed into Dayjs objects
 * and unix timestamps are auto-detected.
 *
 * @param type - Target item type (defaults to `"string"` when falsy).
 * @param value - Raw value to normalise.
 * @returns Normalised value matching the expected type.
 */
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

/**
 * Clone a {@link UnionFaasItemElement} while injecting additional React props.
 *
 * If the element is a React element it is cloned in-place; if it is a function component
 * it is instantiated via `createElement` with the given props.
 *
 * @param element - React element or function component to clone.
 * @param props - Props injected into the cloned element.
 * @returns Cloned React element with the injected props.
 */
export function cloneUnionFaasItemElement(element: UnionFaasItemElement, props: any) {
  return cloneElement(isValidElement(element) ? element : createElement(element), props)
}
