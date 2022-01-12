/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { BaseItemType } from '../../data'
import { Table, TableProps } from '../../Table'

type ExtendTypes = BaseItemType & {
  type: 'password'
}

describe('Table/extend', () => {
  it('children', function () {
    function ExtendTable (props: TableProps<any, ExtendTypes>) {
      return <Table
        { ...props }
        extendTypes={ { password: { children: <>***</> } } }
      />
    }

    render(<ExtendTable
      items={ [
        {
          id: 'test',
          type: 'password'
        }
      ] }
      dataSource={ [
        {
          id: 1,
          test: 'value'
        }
      ] }
    />)

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('***')).toBeInTheDocument()
  })

  it('render', function () {
    function ExtendTable (props: TableProps<any, ExtendTypes>) {
      return <Table
        { ...props }
        extendTypes={ { password: { render: () => '***' } } }
      />
    }

    render(<ExtendTable
      items={ [
        {
          id: 'test',
          type: 'password'
        }
      ] }
      dataSource={ [
        {
          id: 1,
          test: 'value'
        }
      ] }
    />)

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('***')).toBeInTheDocument()
  })
})
