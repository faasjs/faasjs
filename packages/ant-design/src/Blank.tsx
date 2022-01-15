import { Typography } from 'antd'
import { isNil } from 'lodash'

const text = navigator.language?.includes('CN') ? '空' : 'Empty'

export function Blank (options?: {
  value?: any;
  text?: string;
}) {
  return !options ||
    isNil(options.value) ||
    (Array.isArray(options.value) && !options.value.length) ||
    options.value === '' ? <Typography.Text disabled>{options?.text || text}</Typography.Text> : options.value
}
