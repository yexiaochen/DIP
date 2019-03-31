import { Init, Service } from './Interface.js';
import { mix } from './utils.js'
class Ajax extends mix(Init, Service) {
  constructor() {
    super();
  }
  init() {
    console.log('Service::init')
  }
  request() {
    return this.constructor.name;
  }
}
export default Ajax;