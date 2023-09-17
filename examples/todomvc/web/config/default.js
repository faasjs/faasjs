const context = `${__dirname}/../assets`
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  context: context,
  entry: { app: `${context}/index.ts` },
  output: {
    path: `${__dirname}/../public`,
    filename: '[name]-[contenthash].js',
    publicPath: '/',
  },
  resolve: { extensions: ['.js', '.ts', '.vue'] },
  module: {
    rules: [
      {
        test: /\.vue?$/,
        exclude: /node_modules/,
        use: [{ loader: 'vue-loader' }],
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        loader: 'url-loader',
      },
      {
        test: /\.(js|ts)$/,
        loader: 'babel-loader',
      },
    ],
  },
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    iview: 'iview',
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      hash: true,
      template: `${context}/index.html`,
      filename: 'index.html',
    }),
  ],
}
