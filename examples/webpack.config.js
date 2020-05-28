module.exports = {

  mode: 'development',

  entry: './main.js',
  output: {
    filename: 'example.js'
  },

  module: {
    rules: [{
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      },
      {
        loader: 'css-loader'
      },
      {
        loader: 'css-x2x-loader',
        options: {
          type: 'rem2rpx'
        }
      }]
    }]
  }
}
