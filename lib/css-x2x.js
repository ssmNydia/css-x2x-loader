/*
* 样式单位转换
* x2x
*/
var css = require('css');
var extend = require('extend');

var tagType = [
  {
    type: 'px2rem,rem2px',
    baseDpr: 1
  },
  {
    type: 'px2rpx,rpx2px',
    baseDpr: 2
    
  },
  {
    type: 'rem2rpx,rpx2rem',
    baseDpr: 2
  }
]

var defaultConfig = {
  formTag: 'px',
  toTag: 'rem',
  baseDpr: 2,
  tagUnit: 100, // 100px = 1rem (default: 100)
  tagPrecision: 6 // 数值精确度(小数点位数)
}

function getUnitReg (unit) {
  var reg = null
  switch (unit) {
    case 'rem':
      reg = /\b(\d+(\.\d+)?)rem\b/
    break;
    case 'rpx':
      reg = /\b(\d+(\.\d+)?)rpx\b/
    break;
    default:
      reg = /\b(\d+(\.\d+)?)px\b/
    break;
  }
  return reg
}

function CssX2x (options) {
  this.config = {};
  var target = null
  for(var i = 0; i < tagType.length; i++) {
    if (tagType[i].type.indexOf(options.type) > -1) {
      target = tagType[i]
      target.type = options.type
    }
  }
  if (target) {
    var tags = target.type.split('2')
    target.formTag = tags[0]
    target.toTag = tags[1]
    if (typeof options.baseDpr !== 'undefined') {
      delete options.baseDpr
    }
    delete options.formTag
    delete options.toTag
  } else {
    target = {}
  }
  
  extend(this.config, defaultConfig, target, options);
}

CssX2x.prototype.generateCss = function(cssText) {
  var self = this;
  var config = self.config;
  var astObj = css.parse(cssText);
  var reg = getUnitReg(config.formTag)

  function processRules (rules) {
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i]
      // console.log('rule', rule)
      if (rule.type === 'media') {
         processRules(rule.rules);
         continue;
      } else if (rule.type === 'keyframes') {
        processRules(rule.keyframes);
        continue; 
      } else if (rule.type !== 'rule' && rule.type !== 'keyframe') {
        continue;
      }

      var declarations = rule.declarations;
      for (var j = 0; j < declarations.length; j++) {
        var declaration = declarations[j];

        if (declaration.type === 'declaration' && reg.test(declaration.value)) {
          declaration.value = self._changeValue(config.toTag, declaration.value);
        }
      }

      // if the origin rule has no declarations, delete it
      if (!rules[i].declarations.length) {
        rules.splice(i, 1);
        i--;
      }
    }
  }

  processRules(astObj.stylesheet.rules);

  return css.stringify(astObj)
};

CssX2x.prototype._changeValue = function(unit, value) {
  var config = this.config;
  var reg = new RegExp(getUnitReg(config.formTag).source, 'g')

  function getValue(val) {
    val = parseFloat(val.toFixed(config.tagPrecision)); // control decimal precision of the calculated value
    return val == 0 ? val : val + unit;
  }

  return value.replace(reg, function($0, $1) {
    if (unit === 'px') {
      return config.formTag === 'rem' ? getValue($1 * config.tagUnit) : getValue($1 / config.baseDpr)
    } else if (unit === 'rpx') {
      return config.formTag === 'rem' ? getValue($1 * config.tagUnit * config.baseDpr) : getValue($1 * config.baseDpr)
    } else if (unit === 'rem') {
      return config.formTag === 'px' ? getValue($1 / config.tagUnit) : getValue($1 / config.baseDpr)
    } else {
      return $1
    }
  });
};


module.exports = CssX2x