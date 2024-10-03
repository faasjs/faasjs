/**
 * @jest-environment @happy-dom/jest-environment
 */
import { render, screen } from '@testing-library/react'
import { Description } from '../../Description'
import dayjs from 'dayjs'

describe('Description/items', () => {
  it('should work', () => {
    render(
      <Description
        items={[{ id: 'test' }, null]}
        dataSource={{ test: 'value' }}
      />
    )

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
      />
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
      />
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
        />
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
        />
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
        />
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
        />
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
        />
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
        />
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
        />
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
        />
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
        />
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
        />
      )
      expect(screen.getByText('Test')).toBeDefined()
      expect(screen.getByText(now.format('YYYY-MM-DD'))).toBeDefined()
    })
  })
})
