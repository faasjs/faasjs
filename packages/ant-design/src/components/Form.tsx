import {
  Form as AntdForm,
  FormProps as AntdFormProps,
} from 'antd'
import { FormItem, FormItemProps } from './FormItem'

export type FormProps<T = any> = { items: FormItemProps[] } & AntdFormProps<T>

const Form = function<T = any> (props: FormProps<T>) {
  return <AntdForm<T> { ...props }>
    {props.items.map(item => <FormItem
      key={ item.id }
      { ...item }
    />)}
  </AntdForm>
}

Form.useForm = AntdForm.useForm

export { Form }
