import {
  Form as AntdForm,
  FormProps as AntdFormProps,
} from 'antd'
import { FormItem, FormItemProps } from './FormItem'

export type FormProps = { items: FormItemProps[] } & AntdFormProps

const Form = function (props: FormProps) {
  console.log(props)
  return <AntdForm { ...props }>
    {props.items.map(item => <FormItem
      key={ item.id }
      { ...item }
    />)}
  </AntdForm>
}

Form.useForm = AntdForm.useForm

export { Form }
