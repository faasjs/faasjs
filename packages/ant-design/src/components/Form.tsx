import {
  Form as AntdForm,
  FormProps as AntdFormProps,
} from 'antd'
import { FormItem, FormItemProps } from './FormItem'

export type FormProps = { items: FormItemProps[] } & AntdFormProps

export function Form (props: FormProps) {
  console.log(props)
  return <AntdForm { ...props }>
    {props.items.map(item => <FormItem
      key={ item.id }
      { ...item }
    />)}
  </AntdForm>
}
