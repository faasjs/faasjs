import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  Description,
  type DescriptionProps,
  type ExtendDescriptionItemProps,
  type ExtendDescriptionTypeProps,
} from '../../Description'

type ExtendTypes = ExtendDescriptionItemProps & {
  type: 'password'
}

describe('Description/extend', () => {
  it.each([
    ['children', { children: <>***</> }],
    ['render', { render: () => <>***</> }],
  ] satisfies [string, ExtendDescriptionTypeProps][])('%s', (_, passwordType) => {
    function ExtendedDescription(props: DescriptionProps<any, ExtendTypes>) {
      return <Description {...props} extendTypes={{ password: passwordType }} />
    }

    render(
      <ExtendedDescription
        items={[
          {
            id: 'test',
            type: 'password',
          },
        ]}
        dataSource={{ test: 'value' }}
      />,
    )

    expect(screen.getByText('Test')).toBeDefined()
    expect(screen.getByText('***')).toBeDefined()
  })
})
