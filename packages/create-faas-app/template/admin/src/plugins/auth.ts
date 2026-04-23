import type { InvokeData, Next, Plugin } from '@faasjs/core'

export type CurrentUser = {
  id: number
  name: string
  role: 'admin'
}

export class AuthPlugin implements Plugin {
  public readonly name = 'auth'
  public readonly type = 'auth'

  public async onInvoke(data: InvokeData, next: Next): Promise<void> {
    const token = data.event?.headers?.authorization || data.event?.headers?.Authorization

    if (token === 'Bearer demo-admin')
      data.current_user = {
        id: 1,
        name: 'Demo Admin',
        role: 'admin',
      } satisfies CurrentUser

    await next()
  }
}
