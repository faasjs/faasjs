type ClientOnError = {
  onError?: (action: string, params: any) => (error: any) => Promise<void>
}

export function isAbortedRequestError(error: any): boolean {
  return (
    typeof error?.message === 'string' &&
    (error.message as string).toLowerCase().indexOf('aborted') >= 0
  )
}

export function shouldRetryRequestError(fails: number, error: any): boolean {
  return (
    !fails && typeof error?.message === 'string' && error.message.indexOf('Failed to fetch') >= 0
  )
}

export async function applyClientOnError(
  client: ClientOnError,
  action: string,
  params: any,
  error: any,
): Promise<any> {
  let resolvedError = error

  if (client.onError)
    try {
      await client.onError(action, params)(error)
    } catch (newError) {
      resolvedError = newError
    }

  return resolvedError
}
