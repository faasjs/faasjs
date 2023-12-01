/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { ExtendTableItemProps, Table, TableProps } from '../../Table'

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

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('***')).toBeInTheDocument()
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

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('***')).toBeInTheDocument()
  })
})
