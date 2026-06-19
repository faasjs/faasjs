import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import dayjs from 'dayjs'
import { beforeEach, describe, expect, it } from 'vitest'

import type { UnionFaasItemElement, UnionFaasItemRender } from '../../data'
import { Table, type TableItemProps } from '../../Table'

const dateTimeValue = dayjs('2024-01-02 03:04:05')

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
      />,
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
        />,
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
        />,
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
        />,
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
              options: Array.from({ length: 100 }, (_, i) => i),
            },
          ]}
          dataSource={[
            {
              id: 'id',
              test: 'value',
            },
          ]}
        />,
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
        />,
      )
    })

    async function selectBooleanFilter(optionIndex: number) {
      const user = userEvent.setup({ pointerEventsCheck: 0, delay: 0 })
      const filterButton = screen.getAllByRole('img', { name: 'filter' })[1]

      await user.click(filterButton)
      await user.click(screen.getAllByRole('radio')[optionIndex])
    }

    it('no filter', () => {
      expect(screen.getAllByRole('cell').length).toBe(6)
    })

    it.each([
      ['true', 1],
      ['false', 2],
    ] as const)('filter %s', async (_, optionIndex) => {
      await selectBooleanFilter(optionIndex)
      expect(screen.getAllByRole('cell').length).toBe(2)
    })

    it('filter empty and all', async () => {
      await selectBooleanFilter(3)
      expect(screen.getAllByRole('cell').length).toBe(2)

      await selectBooleanFilter(0)
      expect(screen.getAllByRole('cell').length).toBe(6)
    })
  })

  describe.each([
    ['time', 'YYYY-MM-DD HH:mm:ss'],
    ['date', 'YYYY-MM-DD'],
  ] as const)('%s', (type, format) => {
    it.each([
      ['number', dateTimeValue.unix()],
      ['dayjs', dateTimeValue],
      ['string', dateTimeValue.format()],
    ] as const)('%s', (id, value) => {
      render(
        <Table
          items={[
            {
              id: 'test',
              type,
            },
          ]}
          dataSource={[
            {
              id,
              test: value,
            },
          ]}
        />,
      )
      expect(screen.getByText('Test')).toBeDefined()
      expect(screen.getByText(dateTimeValue.format(format))).toBeDefined()
    })
  })

  it.each([
    ['object', { key: 'value' }],
    ['object[]', [{ key: 'value' }]],
  ] as const)('%s', (type, value) => {
    render(
      <Table
        items={[
          {
            id: 'test',
            type,
            object: [{ id: 'key' }],
          },
        ]}
        dataSource={[
          {
            id: 'id',
            test: value,
          },
        ]}
      />,
    )

    expect(screen.getByText('value')).toBeDefined()
  })

  describe('render', () => {
    function renderUppercaseTable(item: Partial<TableItemProps>) {
      render(
        <Table
          items={[
            {
              id: 'test',
              ...item,
            },
          ]}
          dataSource={[
            {
              id: 'id',
              test: 'value',
            },
          ]}
        />,
      )
    }

    const tableRender: UnionFaasItemRender = (value, _values, _index, scene) =>
      scene === 'table' && <span>{value.toUpperCase()}</span>

    const tableElement: UnionFaasItemElement = ({ scene, value }) => {
      return scene === 'table' ? <span>{value.toUpperCase()}</span> : null
    }

    const UppercaseItem = ({ value = '' }: { value?: string }) => {
      return <span>{value.toUpperCase()}</span>
    }

    it.each([
      ['pure render', { render: (value: string) => value.toUpperCase() }],
      ['union render', { render: tableRender }],
      ['union element', { children: tableElement }],
      ['children', { children: UppercaseItem }],
      ['tableChildren', { tableChildren: UppercaseItem }],
      ['tableRender', { tableRender: (value: string) => value.toUpperCase() }],
    ] satisfies [string, Partial<TableItemProps>][])('%s', (_, item) => {
      renderUppercaseTable(item)
      expect(screen.getByText('VALUE')).toBeDefined()
    })

    it.each(['children', 'tableChildren'] as const)('%s is null', (property) => {
      render(
        <Table
          items={[
            {
              id: 'test',
              [property]: null,
            },
          ]}
          dataSource={[
            {
              id: 'id',
              test: 'value',
            },
          ]}
        />,
      )

      expect(screen.queryByText('test')).toBeNull()
      expect(screen.queryByText('value')).toBeNull()
    })
  })
})
