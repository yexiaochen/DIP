import { Init } from './Interface.js'
class Main extends Init {
  constructor(options) {
    super();
    Object.assign(this, options);
    this.options = options;
    this.render();
  }
  init() {
    (Object.values(this.options)).map(item => item.init());
    console.log('Main::init');
  }
  render() {
    let content = this.Service.request();
    console.log('content from', content);
  }
}
export default Main;