import { useFormContext } from "./context";

export type FormButtonProps = {
  children?: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}

export function FormFooter() {
  const { submitting, setSubmitting, onSubmit, values, Elements } = useFormContext()

  return (
    <Elements.Button
      disabled={submitting}
      onClick={() => {
        setSubmitting(true)
        onSubmit(values).finally(() => setSubmitting(false))
      }}
    >
      Submit
    </Elements.Button>
  )
}
