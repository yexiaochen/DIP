import { Init } from './Interface.js'
class Router extends Init {
  constructor() {
    super();
  }
  init() {
    console.log('Router::init')
  }
}
export default Router;