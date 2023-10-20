// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
export interface FaasActions {}

export type FaasActionPaths = keyof FaasActions

export type FaasAction = FaasActionPaths | Record<string, any>
export type FaasParams<T = any> = T extends FaasActionPaths
  ? FaasActions[T]['Params']
  : any
export type FaasData<T = any> = T extends FaasActionPaths
  ? FaasActions[T]['Data']
  : T
