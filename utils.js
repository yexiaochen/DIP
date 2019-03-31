// from http://es6.ruanyifeng.com/#docs/class-extends
export const mix = function mix(...mixins) {
  class Mix {
    constructor() {
      for (let mixin of mixins) {
        copyProperties(this, new mixin()); // 拷贝实例属性
      }
    }
  }

  for (let mixin of mixins) {
    copyProperties(Mix, mixin); // 拷贝静态属性
    copyProperties(Mix.prototype, mixin.prototype); // 拷贝原型属性
  }

  return Mix;
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if (key !== 'constructor'
      && key !== 'prototype'
      && key !== 'name'
    ) {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}

/**
 * 转换成参数形式
 * @params {Object} 类
 * @return {Object}
 */

export const toOptions = params =>
  Object.entries(params).reduce((accumulator, currentValue) => {
    accumulator[currentValue[0]] = new currentValue[1]()
    return accumulator;
  }, {})