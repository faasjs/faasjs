export type FaasReactClientInstance = {
  id: string
  faas: <PathOrData extends FaasAction>(
    action: string | PathOrData,
    params: FaasParams<PathOrData>
  ) => Promise<Response<FaasData<PathOrData>>>
  useFaas: <PathOrData extends FaasAction>(
    action: string | PathOrData,
    defaultParams: FaasParams<PathOrData>,
    options?: useFaasOptions<PathOrData>
  ) => FaasDataInjection<FaasData<PathOrData>>
  FaasDataWrapper<PathOrData extends FaasAction>(
    props: FaasDataWrapperProps<PathOrData>
  ): JSX.Element
}

/**
 * Injects FaasData props.
 */
export type FaasDataInjection<Data = any> = {
  action: string | any
  params: Record<string, any>
  loading: boolean
  reloadTimes: number
  data: Data
  error: any
  promise: Promise<Response<Data>>
  reload(params?: Record<string, any>): Promise<Response<Data>>
  setData: React.Dispatch<React.SetStateAction<Data>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setPromise: React.Dispatch<React.SetStateAction<Promise<Response<Data>>>>
  setError: React.Dispatch<React.SetStateAction<any>>
}

export type FaasDataWrapperProps<PathOrData extends FaasAction> = {
  render?(
    args: FaasDataInjection<FaasData<PathOrData>>
  ): JSX.Element | JSX.Element[]
  children?: React.ReactElement<Partial<FaasDataInjection>>
  fallback?: JSX.Element | false
  action: string
  params?: FaasParams<PathOrData>
  onDataChange?(args: FaasDataInjection<FaasData<PathOrData>>): void
  /** use custom data, should work with setData */
  data?: FaasData<PathOrData>
  /** use custom setData, should work with data */
  setData?: React.Dispatch<React.SetStateAction<FaasData<PathOrData>>>
}

export type useFaasOptions<PathOrData extends FaasAction> = {
  params?: FaasParams<PathOrData>
  data?: FaasData<PathOrData>
  setData?: React.Dispatch<React.SetStateAction<FaasData<PathOrData>>>
  /** if skip is true, will not send request */
  skip?: boolean | ((params: FaasParams<PathOrData>) => boolean)
  /** send the last request after milliseconds */
  debounce?: number
}
