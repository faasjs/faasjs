/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { BaseItemType } from '../../data'
import { Description, DescriptionProps } from '../../Description'

type ExtendTypes = BaseItemType & {
  type: 'password'
}

function ExtendDescription (props: DescriptionProps<any, ExtendTypes>) {
  return <Description
    { ...props }
    extendTypes={ { password: { children: <>***</> } } } />
}

describe('Description/extend', () => {
  it('should work', function () {
    render(<ExtendDescription
      items={ [
        {
          id: 'test',
          type: 'password'
        }
      ] }
      dataSource={ { test: 'value' } }
    />)

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('***')).toBeInTheDocument()
  })
})
