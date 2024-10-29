import { useFormContext } from "./context"
import { FormLabel } from "./Label"

export function FormBody() {
  const { items } = useFormContext()

  return items.map((item) => <FormLabel key={item.name} {...item} />)
}

FormBody.displayName = "FormBody"
FormBody.whyDidYouRender = true
