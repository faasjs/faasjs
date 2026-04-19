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
    query: User
    mutation: User
  }
}
