import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Description } from '../../Description'

describe('Description/coverage', () => {
  it('should render with extendTypes and renderTitle', () => {
    render(
      <Description
        items={[{ id: 'secret', type: 'password' as any }]}
        renderTitle={(data) => data.title}
        extendTypes={{
          password: {
            render: (value) => <>masked:{value}</>,
          },
        }}
        dataSource={{ title: 'From Faas', secret: 'value' }}
      />,
    )

    expect(screen.getByText('From Faas')).toBeDefined()
    expect(screen.getByText('Secret')).toBeDefined()
    expect(screen.getByText('masked:value')).toBeDefined()
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
