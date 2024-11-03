import { useFormContext } from './context'

export function FormFooter() {
  const { submitting, setSubmitting, onSubmit, values, Elements } =
    useFormContext()

  return (
    <Elements.Button
      disabled={submitting}
      submit={() => {
        setSubmitting(true)
        onSubmit(values).finally(() => setSubmitting(false))
      }}
    >
      Submit
    </Elements.Button>
  )
}

FormFooter.displayName = 'FormFooter'
FormFooter.whyDidYouRender = true
