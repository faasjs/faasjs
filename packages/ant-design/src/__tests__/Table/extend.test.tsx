/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { BaseItemType } from '../../data'
import { Table, TableProps } from '../../Table'

 type ExtendTypes = BaseItemType & {
   type: 'password'
 }

function ExtendTable (props: TableProps<any, ExtendTypes>) {
  return <Table
    { ...props }
    extendTypes={ { password: { children: <>***</> } } }
  />
}

describe('Table/extend', () => {
  it('should work', function () {
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
