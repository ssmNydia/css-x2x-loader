# css-x2x-loader
Webpack loader for x2x css file



## Getting Started

To begin, you'll need to install `css-x2x-loader`

```shell
$ npm install --save-dev css-x2x-loader
```



Then add the plugin to your `webpack` config.For example:

#### webpack.config.js

```javascript
module.exports = {
	// ...
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
          tagUnit: 75,
          tagPrecision: 8
        }
      }]
    }]
  }
}

```



## options

| name         | Type     | Default |
| ------------ | -------- | ------- |
| type         | {String} | px2rem  |
| tagUnit      | {Number} | 100     |
| tagPrecision | {Number} | 6       |

#### type

Default: `"px2rem"`

Supported values:

* `px2rpx`
* `rem2px`
* `rem2rpx`
* `rpx2px`
* `rpx2rem`

#### tagUnit

Default: `100`

The `100` value means `100px = 1rem`.

#### tagPrecision

Default: `6`

The `6`value means keep six decimal place.