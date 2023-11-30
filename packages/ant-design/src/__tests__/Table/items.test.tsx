/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import dayjs from 'dayjs'
import { Table } from '../../Table'

describe('Table/items', () => {
  it('should work', () => {
    render(
      <Table
        items={[{ id: 'test' }]}
        dataSource={[
          {
            id: 1,
            test: 'value',
          },
        ]}
      />
    )

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('value')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'filter' })).toBeInTheDocument()
  })

  describe('options', () => {
    it('string', () => {
      render(
        <Table
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
          dataSource={[
            {
              id: 1,
              test: 'value',
            },
          ]}
        />
      )

      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(screen.getByText('label')).toBeInTheDocument()
    })

    it('string[]', async () => {
      const user = userEvent.setup()

      render(
        <Table
          items={[
            {
              id: 'test',
              type: 'string[]',
              options: [
                {
                  label: 'label',
                  value: 'value',
                },
                {
                  label: 'label2',
                  value: 'value2',
                },
              ],
            },
          ]}
          dataSource={[
            {
              id: 1,
              test: ['value', 'value'],
            },
            {
              id: 2,
              test: [],
            },
            {
              id: 3,
              test: null,
            },
          ]}
        />
      )

      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(screen.getByText('label, label')).toBeInTheDocument()

      await user.click(screen.getByRole('img', { name: 'filter' }))

      expect(screen.getByText('label2')).toBeInTheDocument()
    })

    it('optionsType is auto', async () => {
      const user = userEvent.setup()

      render(
        <Table
          items={[
            {
              id: 'test',
              optionsType: 'auto',
            },
          ]}
          dataSource={[
            {
              id: 'id',
              test: 'value',
            },
          ]}
        />
      )

      await user.click(screen.getByRole('img', { name: 'filter' }))

      expect(screen.getAllByText('value').length).toEqual(2)
    })
  })

  describe('boolean', () => {
    beforeEach(() => {
      render(
        <Table
          items={[
            { id: 'id' },
            {
              id: 'test',
              type: 'boolean',
            },
          ]}
          dataSource={[
            {
              id: 'undefined',
              test: undefined,
            },
            {
              id: 'true',
              test: true,
            },
            {
              id: 'false',
              test: false,
            },
          ]}
        />
      )
    })

    it('no filter', () => {
      expect(screen.getAllByRole('cell').length).toBe(6)
    })

    it('filter true', async () => {
      const user = userEvent.setup({ pointerEventsCheck: 0 })

      await user.click(screen.getAllByRole('img', { name: 'filter' })[1])
      await user.click(screen.getAllByRole('radio')[1])

      expect(screen.getAllByRole('cell').length).toBe(2)
      expect(screen.getByText('true')).toBeInTheDocument()
    })

    it('filter false', async () => {
      const user = userEvent.setup({ pointerEventsCheck: 0 })

      await user.click(screen.getAllByRole('img', { name: 'filter' })[1])
      await user.click(screen.getAllByRole('radio')[2])

      expect(screen.getAllByRole('cell').length).toBe(2)
      expect(screen.getByText('false')).toBeInTheDocument()
    })

    it('filter empty and all', async () => {
      const user = userEvent.setup({ pointerEventsCheck: 0 })

      await user.click(screen.getAllByRole('img', { name: 'filter' })[1])
      await user.click(screen.getAllByRole('radio')[3])

      expect(screen.getAllByRole('cell').length).toBe(2)

      await user.click(screen.getAllByRole('img', { name: 'filter' })[1])
      await user.click(screen.getByRole('radio', { name: 'All' }))

      expect(screen.getAllByRole('cell').length).toBe(6)
    })
  })

  describe('time', () => {
    it('number', async () => {
      const now = dayjs()
      render(
        <Table
          items={[
            {
              id: 'test',
              type: 'time',
            },
          ]}
          dataSource={[
            {
              id: 'number',
              test: now.unix(),
            },
          ]}
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
        <Table
          items={[
            {
              id: 'test',
              type: 'time',
            },
          ]}
          dataSource={[
            {
              id: 'dayjs',
              test: now,
            },
          ]}
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
        <Table
          items={[
            {
              id: 'test',
              type: 'time',
            },
          ]}
          dataSource={[
            {
              id: 'string',
              test: now.format(),
            },
          ]}
        />
      )
      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(
        screen.getByText(now.format('YYYY-MM-DD HH:mm:ss'))
      ).toBeInTheDocument()
    })
  })

  describe('date', () => {
    it('number', async () => {
      const now = dayjs()
      render(
        <Table
          items={[
            {
              id: 'test',
              type: 'date',
            },
          ]}
          dataSource={[
            {
              id: 'number',
              test: now.unix(),
            },
          ]}
        />
      )
      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(screen.getByText(now.format('YYYY-MM-DD'))).toBeInTheDocument()
    })

    it('dayjs', () => {
      const now = dayjs()
      render(
        <Table
          items={[
            {
              id: 'test',
              type: 'date',
            },
          ]}
          dataSource={[
            {
              id: 'dayjs',
              test: now,
            },
          ]}
        />
      )
      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(screen.getByText(now.format('YYYY-MM-DD'))).toBeInTheDocument()
    })

    it('string', () => {
      const now = dayjs()
      render(
        <Table
          items={[
            {
              id: 'test',
              type: 'date',
            },
          ]}
          dataSource={[
            {
              id: 'string',
              test: now.format(),
            },
          ]}
        />
      )
      expect(screen.getByText('Test')).toBeInTheDocument()
      expect(screen.getByText(now.format('YYYY-MM-DD'))).toBeInTheDocument()
    })
  })

  it('object', () => {
    render(
      <Table
        items={[
          {
            id: 'test',
            type: 'object',
            object: [{ id: 'key' }],
          },
        ]}
        dataSource={[
          {
            id: 'id',
            test: { key: 'value' },
          },
        ]}
      />
    )

    expect(screen.getByText('value')).toBeInTheDocument()
  })

  it('object[]', () => {
    render(
      <Table
        items={[
          {
            id: 'test',
            type: 'object[]',
            object: [{ id: 'key' }],
          },
        ]}
        dataSource={[
          {
            id: 'id',
            test: [{ key: 'value' }],
          },
        ]}
      />
    )

    expect(screen.getByText('value')).toBeInTheDocument()
  })
})
