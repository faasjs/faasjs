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

function ExtendForm (props: FormProps<any, ExtendTypes>) {
  return <Form
    { ...props }
    extendTypes={ {
      password: {
        baseType: 'string',
        children: <Input.Password />,
      }
    } } />
}

describe('Form/extend', () => {
  it('should work', function () {
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
