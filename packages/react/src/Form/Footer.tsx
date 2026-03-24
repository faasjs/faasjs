import { useCallback } from 'react'

import { useFormContext } from './context'
import { validValues } from './rules'

export function FormFooter() {
  const {
    submitting,
    setSubmitting,
    onSubmit,
    valuesRef,
    Elements,
    items,
    setErrors,
    lang,
    rules,
  } = useFormContext()
  const Button = Elements.Button

  const handleSubmit = useCallback(async () => {
    setSubmitting(true)
    setErrors({})

    const errors = await validValues(rules, items, valuesRef.current, lang)

    if (Object.keys(errors).length) {
      setErrors(errors)
      setSubmitting(false)
      return
    }

    void onSubmit(valuesRef.current).finally(() => setSubmitting(false))
  }, [setSubmitting, setErrors, rules, items, valuesRef, lang, onSubmit])

  return (
    <Button submitting={submitting} submit={handleSubmit}>
      {lang.submit}
    </Button>
  )
}

FormFooter.displayName = 'FormFooter'
