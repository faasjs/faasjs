import { useCallback, useMemo } from 'react'
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

  const handleSubmit = useCallback(async () => {
    setSubmitting(true)
    setErrors({})

    const errors = await validValues(rules, items, valuesRef.current, lang)

    if (Object.keys(errors).length) {
      setErrors(errors)
      setSubmitting(false)
      return
    }

    onSubmit(valuesRef.current).finally(() => setSubmitting(false))
  }, [setSubmitting, setErrors, rules, items, lang, onSubmit])

  const MemoizedButton = useMemo(
    () => (
      <Elements.Button submitting={submitting} submit={handleSubmit}>
        {lang.submit}
      </Elements.Button>
    ),
    [submitting, handleSubmit, lang.submit]
  )

  return MemoizedButton
}

FormFooter.displayName = 'FormFooter'
FormFooter.whyDidYouRender = true
