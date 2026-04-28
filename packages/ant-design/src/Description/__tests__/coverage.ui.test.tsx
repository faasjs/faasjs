import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

let lastDescriptionsProps: any[]
let lastFaasDataWrapperProps: any
let mockedFaasData: any

vi.mock('antd', async () => {
  const React = await import('react')

  return {
    Descriptions(props: any) {
      lastDescriptionsProps.push(props)

      return React.createElement(
        'div',
        { 'data-testid': 'descriptions' },
        props.title
          ? React.createElement('div', { 'data-testid': 'description-title' }, props.title)
          : null,
        (props.items || []).map((item: any) =>
          React.createElement(
            'div',
            {
              key: item.key,
              'data-testid': `description-item-${item.key}`,
            },
            React.createElement('span', null, item.label),
            item.children,
          ),
        ),
      )
    },
    Space(props: any) {
      return React.createElement('div', { 'data-testid': 'space' }, props.children)
    },
    Typography: {
      Text(props: any) {
        return React.createElement('span', props, props.children)
      },
    },
  }
})

vi.mock('../../FaasDataWrapper', async () => ({
  FaasDataWrapper(props: any) {
    lastFaasDataWrapperProps = props

    return props.render?.({ data: mockedFaasData }) ?? null
  },
}))

import { Description } from '../../Description'

describe('Description/coverage', () => {
  beforeEach(() => {
    lastDescriptionsProps = []
    lastFaasDataWrapperProps = undefined
    mockedFaasData = undefined
  })

  it('should forward all faasData options and keep extended rendering', () => {
    const onDataChange = vi.fn()
    const setData = vi.fn()
    const ref = createRef<any>()
    const fallback = <div>fallback</div>

    mockedFaasData = {
      title: 'From Faas',
      secret: 'value',
    }

    render(
      <Description
        items={[{ id: 'secret', type: 'password' as any }]}
        renderTitle={(data) => data.title}
        extendTypes={{
          password: {
            render: (value) => <>masked:{value}</>,
          },
        }}
        faasData={{
          action: 'secret/get',
          baseUrl: '/api/',
          data: { id: 1 },
          fallback,
          onDataChange,
          params: { id: 1 },
          ref,
          setData,
        }}
      />,
    )

    expect(lastFaasDataWrapperProps).toMatchObject({
      action: 'secret/get',
      baseUrl: '/api/',
      data: { id: 1 },
      params: { id: 1 },
      ref,
      setData,
    })
    expect(lastFaasDataWrapperProps.fallback).toBe(fallback)

    lastFaasDataWrapperProps.onDataChange?.({ data: { secret: 'next' } })
    expect(onDataChange).toHaveBeenCalledWith({ data: { secret: 'next' } })

    expect(screen.getByText('From Faas')).toBeDefined()
    expect(screen.getByText('Secret')).toBeDefined()
    expect(screen.getByText('masked:value')).toBeDefined()
    expect(lastDescriptionsProps).toHaveLength(1)
  })

  it('should filter null renderers and render object blanks and lists', () => {
    render(
      <Description
        items={[
          { id: 'skipChildren', children: null },
          { id: 'skipRender', descriptionRender: null },
          {
            id: 'child',
            descriptionChildren: ({ value }: { value?: string }) => <span>child:{value}</span>,
          },
          {
            id: 'objectBlank',
            type: 'object',
            object: [{ id: 'nested' }],
          },
          {
            id: 'objectValue',
            type: 'object',
            object: [{ id: 'nested' }],
          },
          {
            id: 'listBlank',
            type: 'object[]',
            object: [{ id: 'nested' }],
          },
          {
            id: 'listValue',
            type: 'object[]',
            object: [{ id: 'nested' }],
          },
        ]}
        dataSource={{
          child: 'alpha',
          objectBlank: undefined,
          objectValue: { nested: 'one' },
          listBlank: [],
          listValue: [{ nested: 'two' }, { nested: 'three' }],
        }}
      />,
    )

    expect(screen.queryByText('SkipChildren')).toBeNull()
    expect(screen.queryByText('SkipRender')).toBeNull()
    expect(screen.getByText('child:alpha')).toBeDefined()
    expect(screen.getByText('ObjectBlank')).toBeDefined()
    expect(screen.getAllByText('Empty').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('one')).toBeDefined()
    expect(screen.getByText('two')).toBeDefined()
    expect(screen.getByText('three')).toBeDefined()
  })
})
