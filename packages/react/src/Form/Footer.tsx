import { useFormContext } from './context'
import { validValues } from './rules'

export function FormFooter() {
  const {
    submitting,
    setSubmitting,
    onSubmit,
    values,
    Elements,
    items,
    setErrors,
    lang,
  } = useFormContext()

  return (
    <Elements.Button
      disabled={submitting}
      submit={async () => {
        setSubmitting(true)

        const errors = await validValues(items, values, lang)

        if (Object.keys(errors).length) {
          setErrors(errors)
          setSubmitting(false)
          return
        }

        onSubmit(values).finally(() => setSubmitting(false))
      }}
    >
      {lang.submit}
    </Elements.Button>
  )
}

FormFooter.displayName = 'FormFooter'
FormFooter.whyDidYouRender = true
