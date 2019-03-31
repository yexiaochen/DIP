import Service from './Service.js';
import Router from './Router.js';
import Main from './Main.js';
import { toOptions } from './utils.js'

/**
 * toOptions
 * 转换成参数形式
 * @params {Object} 类
 * @return {Object}
 * {
 *    Service: Service实例,
 *    Router: Router实例
 * }
 */
const options = toOptions({ Service, Router });

(new Main(options)).init();