import { FormItem } from './Item'
import { useFormContext } from './context'

export function FormBody() {
  const { items } = useFormContext()

  return items.map(item => <FormItem key={item.name} {...item} />)
}

FormBody.displayName = 'FormBody'
FormBody.whyDidYouRender = true
