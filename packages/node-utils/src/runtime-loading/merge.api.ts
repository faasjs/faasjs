export default {
  config: {
    plugins: {
      extra: {
        type: 'inline-extra',
      },
      func: {
        config: {
          source: 'code',
        },
        type: 'inline-func',
      },
    },
  },
  export() {
    return {
      handler: async () => this.config,
    }
  },
}
