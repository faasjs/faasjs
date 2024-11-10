import type { ComponentType } from 'react'
import { FormButtonElement, type FormButtonElementProps } from './Button'
import { FormInputElement, type FormInputElementProps } from './Input'
import { FormLabelElement, type FormLabelElementProps } from './Label'

export type {
  FormLabelElementProps,
  FormInputElementProps,
  FormButtonElementProps,
}

/**
 * Represents the types of form elements used in the form.
 *
 * @typedef {Object} FormElementTypes
 * @property {ComponentType<FormLabelElementProps>} Label - The component type for the form label element.
 * @property {ComponentType<FormInputElementProps>} Input - The component type for the form input element.
 * @property {ComponentType<FormButtonElementProps>} Button - The component type for the form button element.
 */
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
