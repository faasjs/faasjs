export type User = {
  id: number
  name: string
  metadata: {
    age: number
    gender?: string
  }
}

declare module '../src/types' {
  interface Tables {
    /** @ignore */
    query: User
    /** @ignore */
    mutation: User
  }
}
