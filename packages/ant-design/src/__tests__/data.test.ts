import dayjs from 'dayjs'
import { createElement } from 'react'
import { describe, expect, it } from 'vitest'
import { cloneUnionFaasItemElement, idToTitle, transferOptions, transferValue } from '../data'

describe('transferValue', () => {
  it('should return null', () => {
    expect(transferValue('string', undefined)).toBeNull()
    expect(transferValue('string', null)).toBeNull()
    expect(transferValue('string', '')).toBeNull()
    expect(transferValue('string', 'null')).toBeNull()
    expect(transferValue('string', 'undefined')).toBeNull()
  })

  it('should return string', () => {
    expect(transferValue('string', 'hello')).toBe('hello')
    expect(transferValue(null, 'hello')).toBe('hello')
  })

  it('should return string[]', () => {
    expect(transferValue('string[]', 'hello')).toEqual(['hello'])
    expect(transferValue('string[]', ['hello'])).toEqual(['hello'])
    expect(transferValue('string[]', undefined)).toEqual([])
    expect(transferValue('string[]', null)).toEqual([])
  })

  it('should return number', () => {
    expect(transferValue('number', '1')).toBe(1)
    expect(transferValue('number', '1.1')).toBe(1.1)
    expect(transferValue('number', 1)).toBe(1)
    expect(transferValue('number', 1.1)).toBe(1.1)
  })

  it('should return number[]', () => {
    expect(transferValue('number[]', '1')).toEqual([1])
    expect(transferValue('number[]', '1.1')).toEqual([1.1])
    expect(transferValue('number[]', 1)).toEqual([1])
    expect(transferValue('number[]', 1.1)).toEqual([1.1])
    expect(transferValue('number[]', undefined)).toEqual([])
    expect(transferValue('number[]', null)).toEqual([])
  })

  it('should return boolean', () => {
    expect(transferValue('boolean', 'true')).toBe(true)
    expect(transferValue('boolean', 'false')).toBe(false)
    expect(transferValue('boolean', true)).toBe(true)
    expect(transferValue('boolean', false)).toBe(false)
  })

  it('should return dayjs', () => {
    const date = dayjs(1617235200000).format('YYYY-MM-DD')

    expect(transferValue('date', dayjs(1617235200000)).format('YYYY-MM-DD')).toBe(date)
    expect(transferValue('date', 1617235200000).format('YYYY-MM-DD')).toBe(date)
    expect(transferValue('date', 1617235200).format('YYYY-MM-DD')).toBe(date)
    expect(transferValue('date', '2021-04-01').format('YYYY-MM-DD')).toBe(date)

    expect(transferValue('time', dayjs(1617235200000)).format('YYYY-MM-DD')).toBe(date)
    expect(transferValue('time', 1617235200000).format('YYYY-MM-DD')).toBe(date)
    expect(transferValue('time', 1617235200).format('YYYY-MM-DD')).toBe(date)
    expect(transferValue('time', '2021-04-01').format('YYYY-MM-DD')).toBe(date)
  })
})

it('idToTitle', () => {
  expect(idToTitle('HelloWorld')).toBe('HelloWorld')
  expect(idToTitle('Hello World')).toBe('Hello World')
  expect(idToTitle('hello-world')).toBe('Hello World')
  expect(idToTitle('hello_world')).toBe('Hello World')
})

describe('transferOptions', () => {
  it('should return empty array on falsy input', () => {
    expect(transferOptions(undefined as any)).toEqual([])
  })

  it('should normalize primitive options', () => {
    expect(transferOptions(['hello_world', 2])).toEqual([
      { label: 'Hello World', value: 'hello_world' },
      { label: '2', value: 2 },
    ])
  })
})

describe('cloneUnionFaasItemElement', () => {
  it('should clone element and component with injected props', () => {
    const clonedElement = cloneUnionFaasItemElement(createElement('span'), {
      scene: 'table',
      value: 'value',
    })

    expect((clonedElement as any).props.scene).toBe('table')
    expect((clonedElement as any).props.value).toBe('value')

    const clonedComponent = cloneUnionFaasItemElement(
      (props: { value?: string }) => createElement('span', null, props.value),
      {
        scene: 'form',
        value: 'component-value',
      },
    )

    expect((clonedComponent as any).props.scene).toBe('form')
    expect((clonedComponent as any).props.value).toBe('component-value')
  })
})
