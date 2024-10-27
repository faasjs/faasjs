import { useFormContext } from "./context";

export type FormButtonProps = {
  children?: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}

export function FormFooter() {
  const { submitting, setSubmitting, onSubmit, values, elements } = useFormContext()

  return (
    <elements.button
      disabled={submitting}
      onClick={() => {
        setSubmitting(true)
        onSubmit(values).finally(() => setSubmitting(false))
      }}
    >
      Submit
    </elements.button>
  )
}
