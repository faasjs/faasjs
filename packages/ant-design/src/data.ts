export type FaasItemType =
  'string' | 'string[]' |
  'number' | 'number[]' |
  'boolean'

export type FaasItemTypeValue = {
  string: string
  'string[]': string[]
  number: number
  'number[]': number[]
  boolean: boolean
}

export type FaasItemProps = {
  /**
   * Support string, string[], number, number[], boolean
   * @default 'string'
   */
  type?: FaasItemType
  id: string
  title?: string
}
