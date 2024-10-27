import {
  type ButtonHTMLAttributes,
  type ComponentType,
  forwardRef,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type SelectHTMLAttributes,
} from 'react'
import { FormInput, type FormInputComponent } from './Input'
import type { FormLabelProps } from './Label'
import type { FormButtonProps } from './Footer'

export type FormSelectOption = {
  value: string | number
  label: string
}

export type FormElementTypes = {
  label: ComponentType<FormLabelProps>
  input: FormInputComponent
  select: FormInputComponent<{
    options?: FormSelectOption[]
  }>
  button: ComponentType<FormButtonProps>
}

export const FormElements: FormElementTypes = {
  label: forwardRef<
    HTMLLabelElement,
    LabelHTMLAttributes<HTMLLabelElement> & FormLabelProps
  >(({ name, label, input, rules }, ref) => (
    <label ref={ref}>
      {label?.title ?? name}
      <FormInput name={name} rules={rules} {...input} />
      {label?.description}
    </label>
  )),
  input: forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    (props, ref) => <input {...props} ref={ref} />
  ),
  select: forwardRef<
    HTMLSelectElement,
    SelectHTMLAttributes<HTMLSelectElement> & {
      options?: FormSelectOption[]
    }
  >(({ options, ...props }, ref) => (
    <select {...props} ref={ref}>
      {options?.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )),
  button: forwardRef<
    HTMLButtonElement,
    ButtonHTMLAttributes<HTMLButtonElement> & FormButtonProps
  >(({ disabled, children, onClick, ...props }, ref) => <button type='button' disabled={disabled} onClick={onClick} {...props} ref={ref}>{children}</button>),
}
