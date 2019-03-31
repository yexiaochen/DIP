export class Service {
  request() {
    throw `${this.constructor.name} 没有实现 request 方法！`
  }
}

export class Init {
  init() {
    throw `${this.constructor.name} 没有实现 init 方法！`
  }
}