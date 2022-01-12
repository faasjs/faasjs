/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { Input } from 'antd'
import { BaseItemType } from '../../data'
import { Form, FormProps } from '../../Form'

type ExtendTypes = BaseItemType & {
  type: 'password'
}

describe('Form/extend', () => {
  it('children', function () {
    function ExtendForm (props: FormProps<any, ExtendTypes>) {
      return <Form
        { ...props }
        extendTypes={ { password: { children: <Input.Password />, } } } />
    }

    const { container } = render(<ExtendForm
      items={ [
        {
          id: 'test',
          type: 'password'
        }
      ] } />)

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(container.querySelector('input[type="password"]')).toBeInTheDocument()
  })
})
