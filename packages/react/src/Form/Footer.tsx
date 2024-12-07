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
    rules,
  } = useFormContext()

  return (
    <Elements.Button
      submitting={submitting}
      submit={async () => {
        setSubmitting(true)
        setErrors({})

        const errors = await validValues(rules, items, values, lang)

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
