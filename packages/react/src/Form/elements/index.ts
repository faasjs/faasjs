import type { ComponentType } from 'react'
import { FormLabelElement, type FormLabelElementProps } from './Label'
import { FormInputElement, type FormInputElementProps } from './Input'
import { FormButtonElement, type FormButtonElementProps } from './Button'

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
