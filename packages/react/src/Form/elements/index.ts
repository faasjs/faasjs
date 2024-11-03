import type { ComponentType } from 'react'
import { FormButtonElement, type FormButtonElementProps } from './Button'
import { FormInputElement, type FormInputElementProps } from './Input'
import { FormLabelElement, type FormLabelElementProps } from './Label'

export type {
  FormLabelElementProps,
  FormInputElementProps,
  FormButtonElementProps,
}

export type FormElementTypes = {
  Label: ComponentType<FormLabelElementProps>
  Input: ComponentType<FormInputElementProps>
  Button: ComponentType<FormButtonElementProps>
}

export const FormDefaultElements: FormElementTypes = {
  Label: FormLabelElement,
  Input: FormInputElement,
  Button: FormButtonElement,
}
