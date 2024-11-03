/**
 * @jest-environment @happy-dom/jest-environment
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from '../../Form'

describe('FormItem object', () => {
  it('should work', async () => {
    const user = userEvent.setup()
    let values: string
    render(
      <Form
        initialValues={{ test: [{}] }}
        onValuesChange={v => (values = v)}
        items={[
          {
            id: 'test',
            type: 'object[]',
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

    expect(screen.getByText('String')).toBeDefined()
    expect(screen.getByText('StringList')).toBeDefined()
    expect(screen.getByText('Number')).toBeDefined()
    expect(screen.getByText('NumberList')).toBeDefined()
    expect(screen.getByText('Boolean')).toBeDefined()
    expect(screen.getByText('Date')).toBeDefined()
    expect(screen.getByText('Time')).toBeDefined()
    expect(screen.getByText('SubObject')).toBeDefined()
    expect(screen.getByText('SubString')).toBeDefined()

    await user.type(screen.getByLabelText('SubString'), 'value')

    expect(values).toEqual({ test: [{ subObject: { subString: 'value' } }] })
  })
})
