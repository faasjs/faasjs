import { useFormContext } from './context'
import type { FormLabelElementProps } from './elements/Label'

export type FormLabelProps = FormLabelElementProps

export function FormLabel(props: FormLabelElementProps) {
  const { Elements } = useFormContext()

  if (props.Label) return <props.Label {...props} />

  return <Elements.Label {...props} />
}
