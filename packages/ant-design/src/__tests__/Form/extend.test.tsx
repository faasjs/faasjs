/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { Input } from 'antd'
import {
  Form, FormProps, ExtendItemProps
} from '../../Form'

type ExtendTypes = ExtendItemProps & {
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
          type: 'password',
          required: true,
        }
      ] } />)

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(container.querySelector('input[type="password"]')).toBeInTheDocument()
  })
})
