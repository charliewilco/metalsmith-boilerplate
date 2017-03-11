const path = require('path')

module.exports = {
  devtool: 'source-map',
  entry: './assets/scripts/global.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {test: /\.(js|jsx)$/, use: 'babel-loader'}
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    watchContentBase: true
  }
}
