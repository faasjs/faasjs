/**
 * @jest-environment @happy-dom/jest-environment
 */

import { act, fireEvent, render, screen } from '@testing-library/react'
import { type ComponentProps, useState } from 'react'
import { useStateRef } from '../../useStateRef'
import { FormFooter } from '../Footer'
import type { FormItemProps } from '../Item'
import { FormContextProvider } from '../context'
import { FormDefaultElements } from '../elements'
import { FormDefaultLang } from '../lang'
import { FormDefaultRules } from '../rules'

function Provider(props: {
  children?: React.ReactElement
  items?: FormItemProps[]
  onSubmit?: () => Promise<void>
  setErrors?: () => void
}) {
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [values, setValues, valuesRef] = useStateRef({})

  return (
    <FormContextProvider
      initializeStates={{
        submitting: false,
        errors: {},
      }}
      value={
        {
          items: props.items || [],
          Elements: FormDefaultElements,
          rules: FormDefaultRules,
          lang: FormDefaultLang,
          values,
          setValues,
          valuesRef,
          onSubmit: props.onSubmit,
          submitting,
          setSubmitting,
          errors,
          setErrors: props.setErrors || setErrors,
        } as any
      }
      memo
    >
      {props.children}
    </FormContextProvider>
  )
}

const renderWithContext = (
  children: React.ReactElement,
  props: Omit<ComponentProps<typeof Provider>, 'children'> = {}
) => render(<Provider {...props}>{children}</Provider>)

describe('FormFooter', () => {
  it('should render the submit button', () => {
    const { getByText } = renderWithContext(<FormFooter />)

    expect(getByText('Submit')).not.toBeNull()
  })

  it('should call onSubmit and setSubmitting when button is clicked', async () => {
    const { getByText } = renderWithContext(<FormFooter />, {
      onSubmit: () => new Promise(r => setTimeout(r, 200)),
    })
    const button = getByText('Submit') as HTMLButtonElement

    fireEvent.click(button)

    expect(button.disabled).toBeTruthy()

    await act(async () => new Promise(r => setTimeout(r, 100)))

    expect(button.disabled).toBeTruthy()

    await act(async () => new Promise(r => setTimeout(r, 100)))

    expect(button.disabled).toBeFalsy()
  })

  it('should set errors and not call onSubmit if validation fails', async () => {
    const setErrors = jest.fn()
    const onSubmit = jest.fn()

    renderWithContext(<FormFooter />, {
      items: [{ name: 'test', rules: { required: true } }],
      setErrors,
      onSubmit,
    })

    const button = screen.getByText('Submit') as HTMLButtonElement

    await act(async () => {
      fireEvent.click(button)
    })

    expect(setErrors).toHaveBeenCalledWith({
      test: Error('This field is required'),
    })
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
