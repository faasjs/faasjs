/**
 * @jest-environment jsdom
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

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('value')).toBeInTheDocument()
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

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.queryByText('value')).toBeNull()
    expect(screen.getByText('Children')).toBeInTheDocument()
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

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('value value')).toBeInTheDocument()
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

      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(screen.getByText('label')).toBeInTheDocument()
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

      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(screen.getByText('label, label')).toBeInTheDocument()
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
      expect(screen.getByText('Test')).toBeInTheDocument()
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
      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(
        screen.getByText(now.format('YYYY-MM-DD HH:mm:ss'))
      ).toBeInTheDocument()
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
      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(
        screen.getByText(now.format('YYYY-MM-DD HH:mm:ss'))
      ).toBeInTheDocument()
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
      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(
        screen.getByText(now.format('YYYY-MM-DD HH:mm:ss'))
      ).toBeInTheDocument()
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
      expect(screen.getByText('Test')).toBeInTheDocument()
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
      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(screen.getByText(now.format('YYYY-MM-DD'))).toBeInTheDocument()
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
      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(screen.getByText(now.format('YYYY-MM-DD'))).toBeInTheDocument()
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
      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(screen.getByText(now.format('YYYY-MM-DD'))).toBeInTheDocument()
    })
  })
})
