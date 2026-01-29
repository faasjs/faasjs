import { useFormContext } from './context'
import { FormItem } from './Item'

export function FormBody() {
  const { items } = useFormContext()

  return items.map(item => <FormItem key={item.name} {...item} />)
}

FormBody.displayName = 'FormBody'
