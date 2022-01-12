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

export type BaseItemType = {
  id: string
  title?: string
}

export type FaasItemProps = BaseItemType & {
  /**
   * Support string, string[], number, number[], boolean
   * @default 'string'
   */
  type?: FaasItemType
}
