export const func = {
  config: Object.create(null),
  export() {
    return {
      handler: async () => 'legacy',
    }
  },
}

export default {
  config: Object.create(null),
  export() {
    return {
      handler: async () => 'default',
    }
  },
}
