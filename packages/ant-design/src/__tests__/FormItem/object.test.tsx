/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from '../../Form'

describe('FormItem object', () => {
  it('should work', async () => {
    const user = userEvent.setup()
    let values
    render(
      <Form
        onValuesChange={v => (values = v)}
        items={[
          {
            id: 'test',
            type: 'object',
            object: [
              {
                id: 'string',
                type: 'string',
              },
              {
                id: 'stringList',
                type: 'string[]',
              },
              {
                id: 'number',
                type: 'number',
              },
              {
                id: 'numberList',
                type: 'number[]',
              },
              {
                id: 'boolean',
                type: 'boolean',
              },
              {
                id: 'date',
                type: 'date',
              },
              {
                id: 'time',
                type: 'time',
              },
              {
                id: 'subObject',
                type: 'object',
                object: [
                  {
                    id: 'subString',
                    type: 'string',
                  },
                ],
              },
            ],
          },
        ]}
      />
    )

    expect(screen.getByText('String')).toBeInTheDocument()
    expect(screen.getByText('StringList')).toBeInTheDocument()
    expect(screen.getByText('Number')).toBeInTheDocument()
    expect(screen.getByText('NumberList')).toBeInTheDocument()
    expect(screen.getByText('Boolean')).toBeInTheDocument()
    expect(screen.getByText('Date')).toBeInTheDocument()
    expect(screen.getByText('Time')).toBeInTheDocument()
    expect(screen.getByText('SubObject')).toBeInTheDocument()
    expect(screen.getByText('SubString')).toBeInTheDocument()

    await user.type(screen.getByLabelText('SubString'), 'value')

    expect(values).toEqual({ test: { subObject: { subString: 'value' } } })
  })
})
