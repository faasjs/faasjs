import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import type { Dayjs } from 'dayjs'
import type { JSX } from 'react'

import { Blank } from '../Blank'
import type { FaasItemType } from './index'

function renderBooleanIcon(value: boolean): JSX.Element {
  return value ? (
    <CheckOutlined
      style={{
        marginTop: '4px',
        color: '#52c41a',
      }}
    />
  ) : (
    <CloseOutlined
      style={{
        marginTop: '4px',
        color: '#ff4d4f',
      }}
    />
  )
}

function formatDateValue(value: Dayjs, type: 'date' | 'time'): string {
  return value.format(type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss')
}

function resolveOptionLabel(
  value: any,
  options: { label: string; value?: string | number }[],
): any {
  if (!options?.length) return value

  for (const option of options) if (option.value === value) return option.label ?? value

  return value
}

export function renderDisplayValue(
  type: FaasItemType,
  value: any,
  options?: { label: string; value?: string | number }[],
): JSX.Element | string | number | boolean | null {
  if (value === null || value === undefined || (Array.isArray(value) && value.length === 0))
    return <Blank />

  if (options?.length) {
    if (type.endsWith('[]'))
      return <>{(value as any[]).map((v) => resolveOptionLabel(v, options)).join(', ')}</>
    if (['string', 'number', 'boolean'].includes(type))
      return <>{resolveOptionLabel(value, options)}</>
  }

  switch (type) {
    case 'string[]':
    case 'number[]':
      return <>{(value as any[]).join(', ')}</>
    case 'boolean':
      return renderBooleanIcon(value)
    case 'time':
      return <>{formatDateValue(value as Dayjs, 'time')}</>
    case 'date':
      return <>{formatDateValue(value as Dayjs, 'date')}</>
    default:
      return value as any
  }
}
