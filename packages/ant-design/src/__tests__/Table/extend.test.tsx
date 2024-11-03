/**
 * @jest-environment @happy-dom/jest-environment
 */

import { render, screen } from '@testing-library/react'
import { type ExtendTableItemProps, Table, type TableProps } from '../../Table'

type ExtendTypes = {
  type: 'password'
} & ExtendTableItemProps

describe('Table/extend', () => {
  it('children', () => {
    function ExtendTable(props: TableProps<any, ExtendTypes>) {
      return (
        <Table {...props} extendTypes={{ password: { children: <>***</> } }} />
      )
    }

    render(
      <ExtendTable
        items={[
          {
            id: 'test',
            type: 'password',
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
    expect(screen.getByText('***')).toBeDefined()
  })

  it('render', () => {
    function ExtendTable(props: TableProps<any, ExtendTypes>) {
      return (
        <Table
          {...props}
          extendTypes={{ password: { render: () => <>***</> } }}
        />
      )
    }

    render(
      <ExtendTable
        items={[
          {
            id: 'test',
            type: 'password',
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
    expect(screen.getByText('***')).toBeDefined()
  })
})
