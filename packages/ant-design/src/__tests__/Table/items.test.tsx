import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import dayjs from 'dayjs'
import { beforeEach, describe, expect, it } from 'vitest'
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

    expect(screen.getByText('Test')).toBeDefined()
    expect(screen.getByText('value')).toBeDefined()
    expect(screen.getByRole('img', { name: 'filter' })).toBeDefined()
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

      expect(screen.getByText('Test')).toBeDefined()
      expect(screen.getByText('label')).toBeDefined()
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

      expect(screen.getByText('Test')).toBeDefined()
      expect(screen.getByText('label, label')).toBeDefined()

      await user.click(screen.getByRole('img', { name: 'filter' }))

      expect(screen.getByText('label2')).toBeDefined()
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

    it('dropdown', async () => {
      render(
        <Table
          items={[
            {
              id: 'test',
              options: new Array(100).fill(0).map((_, i) => i),
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

      await userEvent.click(screen.getByRole('img', { name: 'filter' }))

      expect(screen.getByText('Search Test')).not.toBeNull()
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
      expect(screen.getByText('true')).toBeDefined()
    })

    it('filter false', async () => {
      const user = userEvent.setup({ pointerEventsCheck: 0 })

      await user.click(screen.getAllByRole('img', { name: 'filter' })[1])
      await user.click(screen.getAllByRole('radio')[2])

      expect(screen.getAllByRole('cell').length).toBe(2)
      expect(screen.getByText('false')).toBeDefined()
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
      expect(screen.getByText('Test')).toBeDefined()
      expect(screen.getByText(now.format('YYYY-MM-DD HH:mm:ss'))).toBeDefined()
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
      expect(screen.getByText('Test')).toBeDefined()
      expect(screen.getByText(now.format('YYYY-MM-DD HH:mm:ss'))).toBeDefined()
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
      expect(screen.getByText('Test')).toBeDefined()
      expect(screen.getByText(now.format('YYYY-MM-DD HH:mm:ss'))).toBeDefined()
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
      expect(screen.getByText('Test')).toBeDefined()
      expect(screen.getByText(now.format('YYYY-MM-DD'))).toBeDefined()
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
      expect(screen.getByText('Test')).toBeDefined()
      expect(screen.getByText(now.format('YYYY-MM-DD'))).toBeDefined()
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
      expect(screen.getByText('Test')).toBeDefined()
      expect(screen.getByText(now.format('YYYY-MM-DD'))).toBeDefined()
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

    expect(screen.getByText('value')).toBeDefined()
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

    expect(screen.getByText('value')).toBeDefined()
  })
})
