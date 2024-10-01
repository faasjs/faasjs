import {
  forwardRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
  type TableHTMLAttributes,
} from 'react'

type ForwardRefExoticTableComponent<T> = ForwardRefExoticComponent<
  TableHTMLAttributes<T> & RefAttributes<T>
>

export type TableElements = {
  table: ForwardRefExoticTableComponent<HTMLTableElement>
  tbody: ForwardRefExoticTableComponent<HTMLTableSectionElement>
  thead: ForwardRefExoticTableComponent<HTMLTableSectionElement>
  tfoot: ForwardRefExoticTableComponent<HTMLTableSectionElement>
  tr: ForwardRefExoticTableComponent<HTMLTableRowElement>
  th: ForwardRefExoticTableComponent<HTMLTableCellElement>
  td: ForwardRefExoticTableComponent<HTMLTableCellElement>
}

export const DefaultTableElements: TableElements = {
  table: forwardRef((props, ref) => <table {...props} ref={ref} />),
  tbody: forwardRef((props, ref) => <tbody {...props} ref={ref} />),
  thead: forwardRef((props, ref) => <thead {...props} ref={ref} />),
  tfoot: forwardRef((props, ref) => <tfoot {...props} ref={ref} />),
  tr: forwardRef((props, ref) => <tr {...props} ref={ref} />),
  th: forwardRef((props, ref) => <th {...props} ref={ref} />),
  td: forwardRef((props, ref) => <td {...props} ref={ref} />),
}

export function mergeElements(elements: Partial<TableElements>): TableElements {
  if (!elements) return DefaultTableElements

  return Object.keys(elements).reduce((prev, key) => {
    if (elements[key as keyof TableElements])
      prev[key as keyof TableElements] = elements[
        key as keyof TableElements
      ] as any

    return prev
  }, DefaultTableElements)
}
