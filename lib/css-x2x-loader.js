var loaderUtils = require('loader-utils')
var x2x = require('./css-x2x')

module.exports = function (source) {
  var options = loaderUtils.getOptions(this)
  var x2xIns = new x2x(options)
  return x2xIns.generateCss(source)
}
