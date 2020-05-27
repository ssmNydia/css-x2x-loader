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
          type: 'px2rem',
          tagUnit: 100,
          tagPrecision: 8
        }
      }]
    }]
  }
}
