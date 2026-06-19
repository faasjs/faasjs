import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import type { UnionFaasItemProps } from '../../data'
import { Form } from '../../Form'

const objectItems: UnionFaasItemProps[] = [
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
]

const cases = [
  {
    expectedValues: { test: { subObject: { subString: 'value' } } },
    type: 'object',
  },
  {
    expectedValues: { test: [{ subObject: { subString: 'value' } }] },
    initialValues: { test: [{}] },
    type: 'object[]',
  },
] satisfies {
  expectedValues: unknown
  initialValues?: Record<string, unknown>
  type: 'object' | 'object[]'
}[]

describe('FormItem object types', () => {
  it.each(cases)('$type should work', async ({ expectedValues, initialValues, type }) => {
    const user = userEvent.setup()
    let values: unknown = {}
    render(
      <Form
        {...(initialValues ? { initialValues } : {})}
        onValuesChange={(v) => (values = v)}
        items={[
          {
            id: 'test',
            object: objectItems,
            type,
          },
        ]}
      />,
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

    expect(values).toEqual(expectedValues)
  })
})
