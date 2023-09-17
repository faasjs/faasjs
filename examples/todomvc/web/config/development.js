const defaultConfig = require('./default.js')
const merge = require('webpack-merge')

module.exports = merge(defaultConfig, {
  mode: 'development',
  name: 'development',
  devServer: {
    contentBase: [`${__dirname}/../public`],
    historyApiFallback: true,
    compress: true,
    inline: false,
    port: 9000,
    proxy: {
      '/_faas': {
        target: 'http://localhost:3000',
        pathRewrite: {
          '^/_faas': '',
        },
      },
    },
  },
})
