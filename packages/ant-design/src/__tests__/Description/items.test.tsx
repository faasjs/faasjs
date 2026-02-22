import { render, screen } from '@testing-library/react'
import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { Description } from '../../Description'

describe('Description/items', () => {
  it('should work', () => {
    render(<Description items={[{ id: 'test' }, null]} dataSource={{ test: 'value' }} />)

    expect(screen.getByText('Test')).toBeDefined()
    expect(screen.getByText('value')).toBeDefined()
  })

  it('children', () => {
    render(
      <Description
        items={[
          {
            id: 'test',
            children: <>Children</>,
          },
        ]}
        dataSource={{ test: 'value' }}
      />,
    )

    expect(screen.getByText('Test')).toBeDefined()
    expect(screen.queryByText('value')).toBeNull()
    expect(screen.getByText('Children')).toBeDefined()
  })

  it('render', () => {
    render(
      <Description
        items={[
          {
            id: 'test',
            render: (value: string) => <>{value} value</>,
          },
        ]}
        dataSource={{ test: 'value' }}
      />,
    )

    expect(screen.getByText('Test')).toBeDefined()
    expect(screen.getByText('value value')).toBeDefined()
  })

  describe('options', () => {
    it('string', () => {
      render(
        <Description
          items={[
            {
              id: 'test',
              options: [
                {
                  label: 'label',
                  value: 'value',
                },
              ],
            },
          ]}
          dataSource={{ test: 'value' }}
        />,
      )

      expect(screen.getByText('Test')).toBeDefined()
      expect(screen.getByText('label')).toBeDefined()
    })

    it('string[]', () => {
      render(
        <Description
          items={[
            {
              id: 'test',
              type: 'string[]',
              options: [
                {
                  label: 'label',
                  value: 'value',
                },
              ],
            },
          ]}
          dataSource={{ test: ['value', 'value'] }}
        />,
      )

      expect(screen.getByText('Test')).toBeDefined()
      expect(screen.getByText('label, label')).toBeDefined()
    })
  })

  describe('time', () => {
    it('undefined', async () => {
      render(
        <Description
          items={[
            {
              id: 'test',
              type: 'time',
            },
          ]}
          dataSource={{
            id: 'undefined',
            test: undefined,
          }}
        />,
      )
      expect(screen.getByText('Test')).toBeDefined()
    })
    it('number', async () => {
      const now = dayjs()
      render(
        <Description
          items={[
            {
              id: 'test',
              type: 'time',
            },
          ]}
          dataSource={{ test: now.unix() }}
        />,
      )
      expect(screen.getByText('Test')).toBeDefined()
      expect(screen.getByText(now.format('YYYY-MM-DD HH:mm:ss'))).toBeDefined()
    })
    it('dayjs', () => {
      const now = dayjs()
      render(
        <Description
          items={[
            {
              id: 'test',
              type: 'time',
            },
          ]}
          dataSource={{ test: now }}
        />,
      )
      expect(screen.getByText('Test')).toBeDefined()
      expect(screen.getByText(now.format('YYYY-MM-DD HH:mm:ss'))).toBeDefined()
    })
    it('string', () => {
      const now = dayjs()
      render(
        <Description
          items={[
            {
              id: 'test',
              type: 'time',
            },
          ]}
          dataSource={{ test: now.format() }}
        />,
      )
      expect(screen.getByText('Test')).toBeDefined()
      expect(screen.getByText(now.format('YYYY-MM-DD HH:mm:ss'))).toBeDefined()
    })
  })

  describe('date', () => {
    it('undefined', async () => {
      render(
        <Description
          items={[
            {
              id: 'test',
              type: 'date',
            },
          ]}
          dataSource={{ test: undefined }}
        />,
      )
      expect(screen.getByText('Test')).toBeDefined()
    })
    it('number', async () => {
      const now = dayjs()
      render(
        <Description
          items={[
            {
              id: 'test',
              type: 'date',
            },
          ]}
          dataSource={{
            id: 'number',
            test: now.unix(),
          }}
        />,
      )
      expect(screen.getByText('Test')).toBeDefined()
      expect(screen.getByText(now.format('YYYY-MM-DD'))).toBeDefined()
    })
    it('dayjs', () => {
      const now = dayjs()
      render(
        <Description
          items={[
            {
              id: 'test',
              type: 'date',
            },
          ]}
          dataSource={{
            id: 'dayjs',
            test: now,
          }}
        />,
      )
      expect(screen.getByText('Test')).toBeDefined()
      expect(screen.getByText(now.format('YYYY-MM-DD'))).toBeDefined()
    })
    it('string', () => {
      const now = dayjs()
      render(
        <Description
          items={[
            {
              id: 'test',
              type: 'date',
            },
          ]}
          dataSource={{
            id: 'string',
            test: now.format(),
          }}
        />,
      )
      expect(screen.getByText('Test')).toBeDefined()
      expect(screen.getByText(now.format('YYYY-MM-DD'))).toBeDefined()
    })
  })

  it('should render number and boolean item types', () => {
    const { container } = render(
      <Description
        items={[
          {
            id: 'numberValue',
            type: 'number',
          },
          {
            id: 'numberZero',
            type: 'number',
          },
          {
            id: 'numberList',
            type: 'number[]',
          },
          {
            id: 'booleanTrue',
            type: 'boolean',
          },
          {
            id: 'booleanFalse',
            type: 'boolean',
          },
        ]}
        dataSource={{
          numberValue: 2,
          numberZero: 0,
          numberList: [1, 2],
          booleanTrue: true,
          booleanFalse: false,
        }}
      />,
    )

    expect(screen.getByText('2')).toBeDefined()
    expect(screen.getByText('1, 2')).toBeDefined()
    expect(container.querySelector('.anticon-check')).not.toBeNull()
    expect(container.querySelector('.anticon-close')).not.toBeNull()
    expect(screen.queryByText('0')).toBeNull()
  })

  it('should render object and object[] item types', () => {
    render(
      <Description
        items={[
          {
            id: 'profile',
            type: 'object',
            object: [{ id: 'name' }],
          },
          {
            id: 'emptyProfile',
            type: 'object',
            object: [{ id: 'name' }],
          },
          {
            id: 'profiles',
            type: 'object[]',
            object: [{ id: 'name' }],
          },
          {
            id: 'emptyProfiles',
            type: 'object[]',
            object: [{ id: 'name' }],
          },
        ]}
        dataSource={{
          profile: { name: 'Primary' },
          emptyProfile: null,
          profiles: [{ name: 'Worker 1' }, { name: 'Worker 2' }],
          emptyProfiles: [],
        }}
      />,
    )

    expect(screen.getByText('Primary')).toBeDefined()
    expect(screen.getByText('Worker 1')).toBeDefined()
    expect(screen.getByText('Worker 2')).toBeDefined()
    expect(screen.getAllByText('Empty').length >= 2).toBe(true)
  })

  it('should keep unknown options and support default custom rendering', () => {
    render(
      <Description
        items={[
          {
            id: 'tags',
            type: 'string[]',
            options: [{ label: 'Known', value: 'known' }],
          },
          {
            id: 'mapped',
            options: [{ label: 'Known', value: 'known' }],
          },
          {
            id: 'unmapped',
            options: [{ label: 'Known', value: 'known' }],
          },
          {
            id: 'custom',
            type: 'custom' as any,
            options: [{ label: 'Known', value: 'known' }],
          },
          {
            id: 'customZero',
            type: 'custom' as any,
          },
        ]}
        dataSource={{
          tags: ['known', 'unknown'],
          mapped: 'known',
          unmapped: 'other',
          custom: 'raw',
          customZero: 0,
        }}
      />,
    )

    expect(screen.getByText('Known, unknown')).toBeDefined()
    expect(screen.getByText('Known')).toBeDefined()
    expect(screen.getByText('other')).toBeDefined()
    expect(screen.getByText('raw')).toBeDefined()
    expect(screen.queryByText('0')).toBeNull()
  })

  it('should respect item.if and render blanks without dataSource', () => {
    render(
      <Description
        items={[
          {
            id: 'hidden',
            if: () => false,
          },
          {
            id: 'visible',
          },
        ]}
      />,
    )

    expect(screen.queryByText('Hidden')).toBeNull()
    expect(screen.getByText('Visible')).toBeDefined()
    expect(screen.getByText('Empty')).toBeDefined()
  })
})
