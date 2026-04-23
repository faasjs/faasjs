import '@faasjs/pg'

declare module '@faasjs/pg' {
  interface Tables {
    users: {
      id: number
      name: string
    }
  }
}
