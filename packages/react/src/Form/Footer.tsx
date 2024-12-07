import { useCallback, useEffect, useMemo, useRef } from 'react'
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

  const valueRef = useRef(values)

  useEffect(() => {
    valueRef.current = values
  }, [values])

  const handleSubmit = useCallback(async () => {
    setSubmitting(true)
    setErrors({})

    const errors = await validValues(rules, items, valueRef.current, lang)

    if (Object.keys(errors).length) {
      setErrors(errors)
      setSubmitting(false)
      return
    }

    onSubmit(valueRef.current).finally(() => setSubmitting(false))
  }, [setSubmitting, setErrors, rules, items, lang, onSubmit])

  const MemoizedButton = useMemo(() => <Elements.Button
    submitting={submitting}
    submit={handleSubmit}
  >
    {lang.submit}
  </Elements.Button>, [submitting, handleSubmit, lang.submit])

  return MemoizedButton
}

FormFooter.displayName = 'FormFooter'
FormFooter.whyDidYouRender = true
