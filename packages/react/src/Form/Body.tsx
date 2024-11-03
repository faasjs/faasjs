import { FormLabel } from './Label'
import { useFormContext } from './context'

export function FormBody() {
  const { items } = useFormContext()

  return items.map(item => <FormLabel key={item.name} {...item} />)
}

FormBody.displayName = 'FormBody'
FormBody.whyDidYouRender = true
