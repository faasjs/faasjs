export default {
  config: {
    plugins: {
      extra: {
        type: 'inline-extra',
      },
      api: {
        config: {
          source: 'code',
        },
        type: 'inline-api',
      },
    },
  },
  export() {
    return {
      handler: async () => this.config,
    }
  },
}
