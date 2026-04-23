import '@faasjs/core'
import type { CurrentUser } from '../plugins/auth'

declare module '@faasjs/core' {
  interface DefineApiInject {
    current_user?: CurrentUser
  }
}
