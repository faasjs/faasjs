import dayjs from 'dayjs'
import { cloneElement, createElement, isValidElement } from 'react'

import type { BaseOption, FaasItemType, UnionFaasItemElement } from './types'

export function idToTitle(id: string | number): string {
  if (typeof id === 'number') return id.toString()

  const splitted = id
    .split(/(\s|_|-)/)
    .filter((word) => !/(\s|_|-)/.test(word))
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return splitted.charAt(0).toUpperCase() + splitted.slice(1)
}

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

export function cloneUnionFaasItemElement(element: UnionFaasItemElement, props: any) {
  return cloneElement(isValidElement(element) ? element : createElement(element), props)
}
