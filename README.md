---
title: DIP、IoC、DI、JS
date: 2019-03-31 12:10:40
tags:
    - DIP
    - Ioc
    - DI
category:
    - 这个想法不一定对
---

在这个标题中，除了 **JS** 是乱入之外，其它的几个词汇都是存在一个共同点的，那就是依赖。

> 那么，依赖是什么呢？

比如，现在我正在写这篇博客文，但是我得在电脑上编辑，电脑便是我完成这件事的依赖。而在代码中，最直观的体现是模块之间的依赖。如某个模块依赖另外一个模块，那么另外的那个模块就是该模块的依赖。其实在上篇博客文章《[JaVaScript中的模块](http://www.yexiaochen.com/JaVaScript%E4%B8%AD%E7%9A%84%E6%A8%A1%E5%9D%97/)》中，我们也手写了一个模块依赖管理器。

依赖这个理解起来很简单，但这不代表可以随意的依赖。在写模块的时候，讲究个高内聚低耦合，以提高模块的可拓展性和可维护性。模块依赖了谁，怎么去依赖，都关乎了最终模块的好与坏。

还好在编程界有着提高代码质量的金科玉律，我们可以用理论来指导实践，写出更好的代码。

## 依赖反转原则

> 依赖反转原则（Dependency inversion principle，DIP），是一种特定的解耦形式，使得高层次的模块不依赖于低层次的模块的实现细节，依赖关系被颠倒（反转），从而使得低层次模块依赖于高层次模块的需求抽象。———— 维基百科

该原则规定：

  1. 高层次的模块不应该依赖与低层次的模块，两者都应该依赖于抽象接口。
  2. 抽象接口不应该依赖于具体实现。而具体实现则应该依赖于抽象接口。

现在用一个例子来解释一波。

```JavaScript
// Ajax.js
class Ajax {
  get() {
    return this.constructor.name;
  }
}
export default Ajax;

// main.js
import Ajax from './Ajax';
class Main {
  constructor() {
    this.render()
  }
  render() {
    let content = (new Ajax()).get();
    console.log('content from', content);
  }
}
new Main();
```

刚开始的时候，我们基于 **XMLHttpRequest** 对象，封装了 Ajax 用于请求数据。后来 **fetch** 出来了，我们打算跟上时代的脚步，封装 **fetch** 以取代 **Ajax**。

```JavaScript
// Fetch.js
class Fetch {
  fetch() {
    return this.constructor.name;
  }
}
export default Fetch;

// main.js
import Fetch from './Fetch';
class Main {
  constructor() {
    this.render();
  }
  render() {
    let content = (new Fetch()).fetch();
    console.log('content from', content);
  }
}
new Main();
```

从以上可以看出来，整个替代过程很麻烦，我们需要找出封装请求模块（**Ajax**、**Fetch**）的所有引用，然后替换掉。又由于 **Ajax**、**Fetch** 的方法命名也是不同，所以也需要对应地做更改。

这就是传统的处理依赖关系的方式。在这里 **Main** 是高层次模块，**Ajax**、**Fetch** 是低层次模块。依赖关系创建于高层次模块，且高层次模块直接依赖低层次模块，这种依赖关系限制了高层次模块的复用性。

依赖反转原则则颠倒这种依赖关系，并以上面提到的两个规定作为指导思想。

```JavaScript
// Service.js
class Service {
  request(){
    throw `${this.constructor.name} 没有实现 request 方法！`
  }
}
class Ajax extends Service {
  request(){
      return this.constructor.name;
  }
}
export default Ajax;

// Main.js
import Service from './Service.js';
class Main {
  constructor() {
    this.render();
  }
  render() {
    let content = (new Service).request();
    console.log('content from', content);
  }
}
new Main();
```

在这里我们把共同依赖的 **Service** 作为抽象接口，它就是高层次模块与低层次模块需要共同遵守的契约。在高层次模块中，它会默认 **Service** 会有 **request** 方法用来请求数据。在低层次模块中，它会遵从 **Service** 复写应该存在的方法。这在《[在JavaScript中尝试组合模式](http://www.yexiaochen.com/%E5%9C%A8JavaScript%E4%B8%AD%E5%B0%9D%E8%AF%95%E7%BB%84%E5%90%88%E6%A8%A1%E5%BC%8F/)》中，无论分支对象还是叶对象都实现 `expense()` 方法的道理差不多。

即使后来需要封装 **axios** 取代 **fetch**，我们也只需要在 **Service.js** 中修改即可。

再次回顾下传统的依赖关系。

> 依赖关系创建于高层次模块，且高层次模块直接依赖低层次模块。

经过以上的折腾，我们充其量只是解决了高层次模块直接依赖低层次模块的问题。那么依赖关系创建于高层次模块的问题呢？

## 控制反转

如果说依赖反转原则告诉我们该依赖谁，那么控制反转则告诉们谁应该来控制依赖。

像上面的 **Main** 模块，它依赖 **Service** 模块。为了获得 **Service** 实例的引用，**Main** 在内部靠自身 `new` 出了一个 **Service** 实例。这样明显地引用其它模块，无异加大了模块间的耦合。

> 控制反转（Inversion of Control，IoC），通过控制反转，对象在被创建的时候，有一个控制系统内所有对象的外界实体，将其所依赖的对象的引用传递给它。可以说，依赖被注入到对象中。———— 维基百科

这些话的意思就是将依赖对象的创建和绑定转移到被依赖对象类的外部来实现。实现控制反转最常见的方式是依赖注入，还有一种方式依赖查找。

### 依赖注入

> 依赖注入（Dependency Injection，DI），在软件工程中，依赖注入是种实现控制反转用于解决依赖性设计模式。一个依赖关系指的是可被利用的一种对象（即服务提供端）。依赖注入是将所依赖的传递给将使用的从属对象（即客户端）。该服务将会变成客户端的状态的一部分。传递服务给客户端，而非允许客户端来建立或寻找服务，是本设计模式的基本要求。

没看懂？没关系。这句话讲的是，把过程放在外面，将结果带入内部。在《[JaVaScript中的模块](http://www.yexiaochen.com/JaVaScript%E4%B8%AD%E7%9A%84%E6%A8%A1%E5%9D%97/)》中，我们已经用到过依赖注入，就是`对于依赖模块的模块，则把依赖作为参数使用`。

所以我们再次改造下，

```JavaScript
// Service.js
class Service {
  request() {
    throw `${this.constructor.name} 没有实现 request 方法！`
  }
}
class Ajax extends Service {
  request() {
    return this.constructor.name;
  }
}
export default Ajax;
// Main.js
class Main {
  constructor(options) {
    this.Service = options.Service;
    this.render();
  }
  render() {
    let content = this.Service.request();
    console.log('content from', content);
  }
}
export default Main;
// index.js
import Service from './Service.js';
import Main from './Main.js';
new Main({
  Service: new Service()
})
```

在 **Main** 模块中, **Service** 的实例化是在外部完成，并在 `index.js` 中注入。相比上一次，改动后的代码并没有看出带来多大的好处。如果我们再增加一个模块呢？

```JavaScript
class Router {
  constructor() {
    this.init();
  }
  init() {
    console.log('Router::init')
  }
}
export default Router;
```

```diff
# Main.js
+   this.Service = options.Router;

# index.js
+   import Router from './Router.js'
    new Main({
+        Router: new Service()
    })
```

若是内部实例化就不好处理了。可换成依赖注入后，这个问题就很好解决了。

```JavaScript
// utils.js
export const toOptions = params =>
  Object.entries(params).reduce((accumulator, currentValue) => {
    accumulator[currentValue[0]] = new currentValue[1]()
    return accumulator;
  }, {});

// Main.js
class Main {
  constructor(options) {
    Object.assign(this, options);
    this.render();
  }
  render() {
    let content = this.Service.request();
    console.log('content from', content);
  }
}
export default Main;

// index.js
import Service from './Service.js';
import Router from './Router.js';
import Main from './Main.js';
import { toOptions } from './utils.js'
/**
 * toOptions 转换成参数形式
 * @params {Object} 类
 * @return {Object} {Service: Service实例, Router: Router实例}
 */
const options = toOptions({Service, Router});
new Main(options);
```

因为依赖注入把依赖的引用从外部引入，所以这里使用 `Object.assign(this, options)` 方式，把依赖全部加到了 **this** 上。即使再增加模块，也只需要在 `index.js` 中引入即可。

到了这里，**DIP**、**IoC**、**DI** 的概念应该有个清晰的认识了。然后我们再结合实际，加个功能再次巩固以下。作为一功能个独立的模块，一般都有个初始化的过程。

现在我们要做的是遵守一个初始化的约定，定义一个抽象接口，

```JavaScript
// Interface.js
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
// Service.js
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
```

**Main**、**Service**、**Router** 都依赖 **Init** 接口（在这里就是一种协定），**Service** 模块比较特殊，所以做了 **Mixin** 处理。要做到统一初始化，**Main** 还需要做些事。

```JavaScript
// Main.js
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
```

至此，结束

```JavaScript
// index.js
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

//  content from Ajax
//  Service::init
//  Router::init
//  Main::init
```