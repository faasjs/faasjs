import { Typography } from 'antd'
import { isNil } from 'lodash'
import { useFaasState } from './Config'

export type BlankProps = {
  value?: any;
  text?: string;
}

export function Blank (options?: BlankProps) {
  const [config] = useFaasState()

  return !options ||
    isNil(options.value) ||
    (Array.isArray(options.value) && !options.value.length) ||
    options.value === '' ? <Typography.Text disabled>{options?.text || config.Blank.text}</Typography.Text> : options.value
}
