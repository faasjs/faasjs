/**
 * @jest-environment @happy-dom/jest-environment
 */
import { render, screen } from '@testing-library/react'
import {
  Description,
  type DescriptionProps,
  type ExtendDescriptionItemProps,
} from '../../Description'

type ExtendTypes = ExtendDescriptionItemProps & {
  type: 'password'
}

describe('Description/extend', () => {
  it('children', () => {
    function ExtendedDescription(props: DescriptionProps<any, ExtendTypes>) {
      return (
        <Description
          {...props}
          extendTypes={{ password: { children: <>***</> } }}
        />
      )
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
      />
    )

    expect(screen.getByText('Test')).toBeDefined()
    expect(screen.getByText('***')).toBeDefined()
  })

  it('render', () => {
    function ExtendedDescription(props: DescriptionProps<any, ExtendTypes>) {
      return (
        <Description
          {...props}
          extendTypes={{ password: { render: () => <>***</> } }}
        />
      )
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
      />
    )

    expect(screen.getByText('Test')).toBeDefined()
    expect(screen.getByText('***')).toBeDefined()
  })
})
