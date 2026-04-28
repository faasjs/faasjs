export default {
  config: Object.create(null),
  export() {
    return {
      handler: async (event?: string) => event,
    }
  },
}
