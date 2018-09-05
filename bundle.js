(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Attribute = Attribute;

var _utils = require("../utils.js");

function Attribute(name, type) {
  var property = (0, _utils.camelCase)(name);
  var attribute = (0, _utils.kebabCase)(name);
  return function define(Class) {
    if (!Class.observedAttributes) {
      Class.observedAttributes = [];
    }

    Class.observedAttributes.push(attribute);
    Object.defineProperty(Class.prototype, property, {
      enumerable: true,
      configurable: true,
      get: function get() {
        if (type === Boolean) {
          return this.hasAttribute(attribute);
        } else if (type.instance) {
          return type.instance(this.getAttribute(attribute));
        } else {
          return type(this.getAttribute(attribute));
        }
      },
      set: function set(value) {
        if (type === Boolean) {
          if (value) {
            this.setAttribute(attribute, '');
          } else {
            this.removeAttribute(attribute);
          }
        } else {
          this.setAttribute(attribute, value);
        }
      }
    });
  };
}

},{"../utils.js":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = Component;
exports.getTagName = getTagName;
exports.register = register;
exports.bootstrap = bootstrap;

var _utils = require("../utils.js");

var COMPONENTS = [];
var sggWidgets = Symbol.for('sggWidgets');

function Component(namespace) {
  return function define(Class) {
    Class.namespace = namespace;

    if (customElements[sggWidgets]) {
      return register(Class);
    }

    COMPONENTS.push(Class);
  };
}

function getTagName(Class) {
  if (Class.tagName) return Class.tagName;
  var namespace = Class.namespace,
      className = Class.className;
  var name = className || Class.name;
  return Class.tagName = (0, _utils.kebabCase)(namespace + name);
}

function register(component) {
  var tagName = getTagName(component);
  var plugins = customElements[sggWidgets];
  var Component = (0, _utils.define)(plugins, component);
  var Element = customElements.get(tagName);

  if (Element) {
    return (0, _utils.transfer)(Element, Component);
  }

  customElements.define(tagName, Component);
}

function bootstrap() {
  var plugins = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  customElements[sggWidgets] = plugins;

  for (var _i = 0; _i < COMPONENTS.length; _i++) {
    var component = COMPONENTS[_i];
    register(component);
  }
}

},{"../utils.js":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Template = Template;

function Template(template) {
  return function define(Class) {
    Class.prototype.template = template;
  };
}

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Component: true,
  bootstrap: true,
  Template: true,
  Attribute: true
};
Object.defineProperty(exports, "Component", {
  enumerable: true,
  get: function get() {
    return _component.Component;
  }
});
Object.defineProperty(exports, "bootstrap", {
  enumerable: true,
  get: function get() {
    return _component.bootstrap;
  }
});
Object.defineProperty(exports, "Template", {
  enumerable: true,
  get: function get() {
    return _template.Template;
  }
});
Object.defineProperty(exports, "Attribute", {
  enumerable: true,
  get: function get() {
    return _attribute.Attribute;
  }
});

var _component = require("./decorators/component.js");

var _template = require("./decorators/template.js");

var _attribute = require("./decorators/attribute.js");

var _utils = require("./utils.js");

Object.keys(_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _utils[key];
    }
  });
});

},{"./decorators/attribute.js":1,"./decorators/component.js":2,"./decorators/template.js":3,"./utils.js":5}],5:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kebabCase = kebabCase;
exports.camelCase = camelCase;
exports.define = define;
exports.middleware = middleware;
exports.plugin = plugin;
exports.transfer = transfer;
var UPPER = /.[A-Z]/g;

function kebabCase(string) {
  return string.replace(UPPER, function (c) {
    return c[0] + '-' + c[1].toLowerCase();
  });
}

function camelCase(string) {
  return string.replace(/-./g, function (c) {
    return c[1].toUpperCase();
  });
}

function define() {
  var decorators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : decorators.pop();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = decorators.reverse()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var transform = _step.value;
      target = transform(target) || target;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return target;
}

function middleware(done) {
  var middleware = [];
  Object.assign(pipeline, {
    use: function use() {
      return middleware.push.apply(middleware, arguments), this;
    }
  });

  function pipeline() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var context = {
      self: this,
      index: 0
    };

    function next() {
      var method = middleware[context.index++];

      if (method) {
        return method.call(context.self, args, next);
      } else if (done) {
        return done.apply(context.self, args);
      }
    }

    return next();
  }

  return pipeline;
}

function plugin(target) {
  for (var _len2 = arguments.length, sources = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    sources[_key2 - 1] = arguments[_key2];
  }

  for (var _i = 0; _i < sources.length; _i++) {
    var source = sources[_i];

    var _arr = Object.entries(source);

    for (var _i2 = 0; _i2 < _arr.length; _i2++) {
      var _arr$_i = _slicedToArray(_arr[_i2], 2),
          property = _arr$_i[0],
          method = _arr$_i[1];

      if (typeof method !== 'function') continue;

      if (!target[property]) {
        target[property] = middleware();
      } else if (!target[property].use) {
        target[property] = middleware(target[property]);
      }

      target[property].use(method);
    }
  }

  return target;
}

function transfer(target) {
  for (var _len3 = arguments.length, sources = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    sources[_key3 - 1] = arguments[_key3];
  }

  for (var _i3 = 0; _i3 < sources.length; _i3++) {
    var source = sources[_i3];
    var properties = Object.getOwnPropertyDescriptors(source);

    var _arr2 = Object.entries(properties);

    for (var _i4 = 0; _i4 < _arr2.length; _i4++) {
      var _arr2$_i = _slicedToArray(_arr2[_i4], 2),
          name = _arr2$_i[0],
          descriptor = _arr2$_i[1];

      if (name === 'prototype') {
        transfer(target.prototype, source.prototype);
      }

      if (descriptor.configurable) {
        Object.defineProperty(target, name, descriptor);
      }
    }
  }
}

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hyper = hyper;

var _utils = require("../utils.js");

var _queue = require("./queue.js");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function hyper(_ref) {
  var bind = _ref.bind;
  var shedule = (0, _queue.queue)(function render(node) {
    return node.template(node.html);
  });
  return function renderer(Class) {
    (0, _utils.plugin)(Class.prototype, {
      attributeChangedCallback: function attributeChangedCallback(args, next) {
        this.render();
        return next();
      },
      connectedCallback: function connectedCallback(args, next) {
        this.render();
        return next();
      },
      render: function render(_ref2, next) {
        var _ref3 = _slicedToArray(_ref2, 1),
            callback = _ref3[0];

        if (!this.html) {
          this.attachShadow({
            mode: 'open'
          });
          this.html = bind(this.shadowRoot);
        }

        shedule(this, function () {
          if (typeof callback === 'function') {
            callback.apply(void 0, arguments);
          }

          next();
        });
      }
    });
  };
}

},{"../utils.js":8,"./queue.js":7}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queue = queue;

var _utils = require("../utils.js");

function queue(render) {
  var queue = new Set();
  var cache = new WeakMap();
  var callbacks = new Set();

  function apply() {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = queue[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var node = _step.value;
        render(node, cache);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  function attempt() {
    try {
      apply();
    } catch (error) {
      throw error;
    } finally {
      queue.clear();
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = callbacks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var callback = _step2.value;
          callback();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      callbacks.clear();
    }
  }

  return function shedule(element, callback) {
    if (!queue.size) {
      requestAnimationFrame(attempt);
    }

    if (typeof callback === 'function') {
      callbacks.add(callback);
    }

    queue.add(element);
  };
}

},{"../utils.js":8}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kebabCase = kebabCase;
exports.camelCase = camelCase;
exports.define = define;
exports.middleware = middleware;
exports.plugin = plugin;
exports.transfer = transfer;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var UPPER = /.[A-Z]/g;

function kebabCase(string) {
  return string.replace(UPPER, function (c) {
    return c[0] + '-' + c[1].toLowerCase();
  });
}

function camelCase(string) {
  return string.replace(/-./g, function (c) {
    return c[1].toUpperCase();
  });
}

function define() {
  var decorators = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : decorators.pop();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = decorators.reverse()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var transform = _step.value;
      target = transform(target) || target;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return target;
}

function middleware(done) {
  var middleware = [];
  Object.assign(pipeline, {
    use: function use() {
      return middleware.push.apply(middleware, arguments), this;
    }
  });

  function pipeline() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var context = {
      self: this,
      index: 0
    };

    function next() {
      var method = middleware[context.index++];

      if (method) {
        return method.call(context.self, args, next);
      } else if (done) {
        return done.apply(context.self, args);
      }
    }

    return next();
  }

  return pipeline;
}

function plugin(target) {
  for (var _len2 = arguments.length, sources = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    sources[_key2 - 1] = arguments[_key2];
  }

  for (var _i = 0; _i < sources.length; _i++) {
    var source = sources[_i];

    var _arr = Object.entries(source);

    for (var _i2 = 0; _i2 < _arr.length; _i2++) {
      var _arr$_i = _slicedToArray(_arr[_i2], 2),
          property = _arr$_i[0],
          method = _arr$_i[1];

      if (typeof method !== 'function') continue;

      if (!target[property]) {
        target[property] = middleware();
      } else if (!target[property].use) {
        target[property] = middleware(target[property]);
      }

      target[property].use(method);
    }
  }

  return target;
}

function transfer(target) {
  for (var _len3 = arguments.length, sources = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    sources[_key3 - 1] = arguments[_key3];
  }

  for (var _i3 = 0; _i3 < sources.length; _i3++) {
    var source = sources[_i3];
    var properties = Object.getOwnPropertyDescriptors(source);

    var _arr2 = Object.entries(properties);

    for (var _i4 = 0; _i4 < _arr2.length; _i4++) {
      var _arr2$_i = _slicedToArray(_arr2[_i4], 2),
          name = _arr2$_i[0],
          descriptor = _arr2$_i[1];

      if (name === 'prototype') {
        transfer(target.prototype, source.prototype);
      }

      if (descriptor.configurable) {
        Object.defineProperty(target, name, descriptor);
      }
    }
  }
}

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wire = exports.hyper = exports.diff = exports.define = exports.bind = exports.Component = exports.default = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*! (c) Andrea Giammarchi (ISC) */
var hyperHTML = function (e) {
  "use strict";

  var t = document.defaultView,
      r = /^area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr$/i,
      l = "ownerSVGElement",
      c = "http://www.w3.org/2000/svg",
      s = "connected",
      f = "dis" + s,
      d = /^style|textarea$/i,
      b = "_hyper: " + (Math.random() * new Date() | 0) + ";",
      h = "\x3c!--" + b + "--\x3e",
      v = t.Event;

  try {
    new v("Event");
  } catch (e) {
    v = function v(e) {
      var t = document.createEvent("Event");
      return t.initEvent(e, !1, !1), t;
    };
  }

  var n,
      i = t.Map || function () {
    var n = [],
        r = [];
    return {
      get: function get(e) {
        return r[n.indexOf(e)];
      },
      set: function set(e, t) {
        r[n.push(e) - 1] = t;
      }
    };
  },
      o = 0,
      p = t.WeakMap || function () {
    var n = b + o++;
    return {
      get: function get(e) {
        return e[n];
      },
      set: function set(e, t) {
        Object.defineProperty(e, n, {
          configurable: !0,
          value: t
        });
      }
    };
  },
      a = t.WeakSet || function () {
    var t = new p();
    return {
      add: function add(e) {
        t.set(e, !0);
      },
      has: function has(e) {
        return !0 === t.get(e);
      }
    };
  },
      m = Array.isArray || (n = {}.toString, function (e) {
    return "[object Array]" === n.call(e);
  }),
      g = b.trim || function () {
    return this.replace(/^\s+|\s+$/g, "");
  };

  function w() {
    return this;
  }

  var u = function u(e, t) {
    var n = "_" + e + "$";
    return {
      get: function get() {
        return this[n] || y(this, n, t.call(this, e));
      },
      set: function set(e) {
        y(this, n, e);
      }
    };
  },
      y = function y(e, t, n) {
    return Object.defineProperty(e, t, {
      configurable: !0,
      value: "function" == typeof n ? function () {
        return e._wire$ = n.apply(this, arguments);
      } : n
    })[t];
  },
      N = {},
      x = {},
      E = [],
      C = x.hasOwnProperty,
      j = 0,
      A = {
    attributes: N,
    define: function define(e, t) {
      e.indexOf("-") < 0 ? (e in x || (j = E.push(e)), x[e] = t) : N[e] = t;
    },
    invoke: function invoke(e, t) {
      for (var n = 0; n < j; n++) {
        var r = E[n];
        if (C.call(e, r)) return x[r](e[r], t);
      }
    }
  },
      k = function k(e, t) {
    return T(e).createElement(t);
  },
      T = function T(e) {
    return e.ownerDocument || e;
  },
      O = function O(e) {
    return T(e).createDocumentFragment();
  },
      S = function S(e, t) {
    return T(e).createTextNode(t);
  },
      L = " \\f\\n\\r\\t",
      M = "[^ " + L + "\\/>\"'=]+",
      $ = "[ " + L + "]+" + M,
      D = "<([A-Za-z]+[A-Za-z0-9:_-]*)((?:",
      P = "(?:=(?:'[^']*?'|\"[^\"]*?\"|<[^>]*?>|" + M + "))?)",
      B = new RegExp(D + $ + P + "+)([ " + L + "]*/?>)", "g"),
      R = new RegExp(D + $ + P + "*)([ " + L + "]*/>)", "g"),
      _ = O(document),
      H = "append" in _,
      z = "content" in k(document, "template");

  _.appendChild(S(_, "g")), _.appendChild(S(_, ""));

  var F = 1 === _.cloneNode(!0).childNodes.length,
      Z = "importNode" in document,
      I = H ? function (e, t) {
    e.append.apply(e, t);
  } : function (e, t) {
    for (var n = t.length, r = 0; r < n; r++) {
      e.appendChild(t[r]);
    }
  },
      V = new RegExp("(" + $ + "=)(['\"]?)" + h + "\\2", "gi"),
      W = function W(e, t, n, r) {
    return "<" + t + n.replace(V, q) + r;
  },
      q = function q(e, t, n) {
    return t + (n || '"') + b + (n || '"');
  },
      G = function G(e, t) {
    return (l in e ? ee : Y)(e, t.replace(B, W));
  },
      J = F ? function (e) {
    for (var t = e.cloneNode(), n = e.childNodes || [], r = n.length, i = 0; i < r; i++) {
      t.appendChild(J(n[i]));
    }

    return t;
  } : function (e) {
    return e.cloneNode(!0);
  },
      K = Z ? function (e, t) {
    return e.importNode(t, !0);
  } : function (e, t) {
    return J(t);
  },
      Q = [].slice,
      U = function U(e) {
    return _X(e);
  },
      _X = function X(e) {
    if (e.propertyIsEnumerable("raw") || /Firefox\/(\d+)/.test((t.navigator || {}).userAgent) && parseFloat(RegExp.$1) < 55) {
      var n = {};

      _X = function X(e) {
        var t = "^" + e.join("^");
        return n[t] || (n[t] = e);
      };
    } else _X = function X(e) {
      return e;
    };

    return _X(e);
  },
      Y = z ? function (e, t) {
    var n = k(e, "template");
    return n.innerHTML = t, n.content;
  } : function (e, t) {
    var n = k(e, "template"),
        r = O(e);

    if (/^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(t)) {
      var i = RegExp.$1;
      n.innerHTML = "<table>" + t + "</table>", I(r, Q.call(n.querySelectorAll(i)));
    } else n.innerHTML = t, I(r, Q.call(n.childNodes));

    return r;
  },
      ee = z ? function (e, t) {
    var n = O(e),
        r = T(e).createElementNS(c, "svg");
    return r.innerHTML = t, I(n, Q.call(r.childNodes)), n;
  } : function (e, t) {
    var n = O(e),
        r = k(e, "div");
    return r.innerHTML = '<svg xmlns="' + c + '">' + t + "</svg>", I(n, Q.call(r.firstChild.childNodes)), n;
  };

  function te(e) {
    this.childNodes = e, this.length = e.length, this.first = e[0], this.last = e[this.length - 1];
  }

  te.prototype.insert = function () {
    var e = O(this.first);
    return I(e, this.childNodes), e;
  }, te.prototype.remove = function () {
    var e = this.first,
        t = this.last;
    if (2 === this.length) t.parentNode.removeChild(t);else {
      var n = T(e).createRange();
      n.setStartBefore(this.childNodes[1]), n.setEndAfter(t), n.deleteContents();
    }
    return e;
  };

  var ne = function ne(e, t, n) {
    e.unshift(e.indexOf.call(t.childNodes, n));
  },
      re = function re(e, t, n) {
    return {
      type: e,
      name: n,
      node: t,
      path: function (e) {
        var t = [],
            n = void 0;

        switch (e.nodeType) {
          case 1:
          case 11:
            n = e;
            break;

          case 8:
            n = e.parentNode, ne(t, n, e);
            break;

          default:
            n = e.ownerElement;
        }

        for (e = n; n = n.parentNode; e = n) {
          ne(t, n, e);
        }

        return t;
      }(t)
    };
  },
      ie = function ie(e, t) {
    for (var n = t.length, r = 0; r < n; r++) {
      e = e.childNodes[t[r]];
    }

    return e;
  },
      oe = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i,
      ae = function ae(o, a) {
    var u = void 0,
        l = void 0;
    return function (e) {
      switch (_typeof(e)) {
        case "object":
          if (e) {
            if ("object" === u) {
              if (!a && l !== e) for (var t in l) {
                t in e || (o[t] = "");
              }
            } else a ? o.value = "" : o.cssText = "";

            var n = a ? {} : o;

            for (var r in e) {
              var i = e[r];
              n[r] = "number" != typeof i || oe.test(r) ? i : i + "px";
            }

            u = "object", a ? o.value = ce(l = n) : l = e;
            break;
          }

        default:
          l != e && (u = "string", l = e, a ? o.value = e || "" : o.cssText = e || "");
      }
    };
  },
      ue = /([^A-Z])([A-Z]+)/g,
      le = function le(e, t, n) {
    return t + "-" + n.toLowerCase();
  },
      ce = function ce(e) {
    var t = [];

    for (var n in e) {
      t.push(n.replace(ue, le), ":", e[n], ";");
    }

    return t.join("");
  },
      se = function se(e, t) {
    return e == t;
  },
      fe = function fe(e) {
    return e;
  },
      de = function de(e, t, n, r) {
    if (null == r) t.removeChild(e(n, -1));else {
      var i = t.ownerDocument.createRange();
      i.setStartBefore(e(n, -1)), i.setEndAfter(e(r, -1)), i.deleteContents();
    }
  },
      he = function he(e, t, n, r) {
    r || (r = {});

    for (var i = r.compare || se, o = r.node || fe, a = null == r.before ? null : o(r.before, 0), u = 0, l = 0, c = t.length - 1, s = t[0], f = t[c], d = n.length - 1, h = n[0], v = n[d]; u <= c && l <= d;) {
      if (null == s) s = t[++u];else if (null == f) f = t[--c];else if (null == h) h = n[++l];else if (null == v) v = n[--d];else if (i(s, h)) s = t[++u], h = n[++l];else if (i(f, v)) f = t[--c], v = n[--d];else if (i(s, v)) e.insertBefore(o(s, 1), o(f, -0).nextSibling), s = t[++u], v = n[--d];else if (i(f, h)) e.insertBefore(o(f, 1), o(s, 0)), f = t[--c], h = n[++l];else {
        var p = t.indexOf(h);
        if (p < 0) e.insertBefore(o(h, 1), o(s, 0)), h = n[++l];else {
          for (var m = p, g = l; m <= c && g <= d && t[m] === n[g];) {
            m++, g++;
          }

          if (1 < m - p) --p === u ? e.removeChild(o(s, -1)) : de(o, e, s, t[p]), l = g, s = t[u = m], h = n[g];else {
            var b = t[p];
            t[p] = null, e.insertBefore(o(b, 1), o(s, 0)), h = n[++l];
          }
        }
      }
    }

    if (u <= c || l <= d) if (c < u) {
      var w = n[d + 1],
          y = null == w ? a : o(w, 0);
      if (l === d) e.insertBefore(o(n[l], 1), y);else {
        for (var N = e.ownerDocument.createDocumentFragment(); l <= d;) {
          N.appendChild(o(n[l++], 1));
        }

        e.insertBefore(N, y);
      }
    } else null == t[u] && u++, u === c ? e.removeChild(o(t[u], -1)) : de(o, e, t[u], t[c]);
    return n;
  },
      ve = new a();

  function pe() {}

  pe.prototype = Object.create(null);

  var me = function me(e) {
    return {
      html: e
    };
  },
      ge = function e(t, n) {
    return "ELEMENT_NODE" in t ? t : t.constructor === te ? 1 / n < 0 ? n ? t.remove() : t.last : n ? t.insert() : t.first : e(t.render(), n);
  },
      be = function be(e, t, n) {
    for (var r = new pe(), i = e.attributes, o = Q.call(i), a = [], u = o.length, l = 0; l < u; l++) {
      var c = o[l];

      if (c.value === b) {
        var s = c.name;

        if (!(s in r)) {
          var f = n.shift().replace(/^(?:|[\S\s]*?\s)(\S+?)=['"]?$/, "$1");
          r[s] = i[f] || i[f.toLowerCase()], t.push(re("attr", r[s], f));
        }

        a.push(c);
      }
    }

    for (var d = a.length, h = 0; h < d; h++) {
      var v = a[h];
      /^id$/i.test(v.name) ? e.removeAttribute(v.name) : e.removeAttributeNode(a[h]);
    }

    var p = e.nodeName;

    if (/^script$/i.test(p)) {
      for (var m = document.createElement(p), g = 0; g < i.length; g++) {
        m.setAttributeNode(i[g].cloneNode(!0));
      }

      m.textContent = e.textContent, e.parentNode.replaceChild(m, e);
    }
  },
      we = function we(e, t) {
    t(e.placeholder), "text" in e ? Promise.resolve(e.text).then(String).then(t) : "any" in e ? Promise.resolve(e.any).then(t) : "html" in e ? Promise.resolve(e.html).then(me).then(t) : Promise.resolve(A.invoke(e, t)).then(t);
  },
      ye = function ye(e) {
    return null != e && "then" in e;
  },
      Ne = function Ne(r, i) {
    var o = {
      node: ge,
      before: r
    },
        a = !1,
        u = void 0;
    return function e(t) {
      switch (_typeof(t)) {
        case "string":
        case "number":
        case "boolean":
          a ? u !== t && (u = t, i[0].textContent = t) : (a = !0, u = t, i = he(r.parentNode, i, [S(r, t)], o));
          break;

        case "object":
        case "undefined":
          if (null == t) {
            a = !1, i = he(r.parentNode, i, [], o);
            break;
          }

        default:
          if (a = !1, m(u = t)) {
            if (0 === t.length) i.length && (i = he(r.parentNode, i, [], o));else switch (_typeof(t[0])) {
              case "string":
              case "number":
              case "boolean":
                e({
                  html: t
                });
                break;

              case "object":
                if (m(t[0]) && (t = t.concat.apply([], t)), ye(t[0])) {
                  Promise.all(t).then(e);
                  break;
                }

              default:
                i = he(r.parentNode, i, t, o);
            }
          } else "ELEMENT_NODE" in (n = t) || n instanceof te || n instanceof w ? i = he(r.parentNode, i, 11 === t.nodeType ? Q.call(t.childNodes) : [t], o) : ye(t) ? t.then(e) : "placeholder" in t ? we(t, e) : "text" in t ? e(String(t.text)) : "any" in t ? e(t.any) : "html" in t ? i = he(r.parentNode, i, Q.call(G(r, [].concat(t.html).join("")).childNodes), o) : e("length" in t ? Q.call(t) : A.invoke(t, e));
      }

      var n;
    };
  },
      xe = function xe(t, n, e) {
    var r = l in t,
        i = void 0;
    if ("style" === n) return function (e, t, n) {
      if (n) {
        var r = t.cloneNode(!0);
        return r.value = "", e.setAttributeNode(r), ae(r, n);
      }

      return ae(e.style, n);
    }(t, e, r);

    if (/^on/.test(n)) {
      var o = n.slice(2);
      return o === s || o === f ? (je && (je = !1, function () {
        var i = function i(e, t) {
          for (var n = new v(t), r = e.length, i = 0; i < r; i++) {
            var o = e[i];
            1 === o.nodeType && a(o, n);
          }
        },
            a = function e(t, n) {
          ve.has(t) && t.dispatchEvent(n);

          for (var r = t.children || function (e) {
            for (var t = [], n = e.childNodes, r = n.length, i = 0; i < r; i++) {
              1 === n[i].nodeType && t.push(n[i]);
            }

            return t;
          }(t), i = r.length, o = 0; o < i; o++) {
            e(r[o], n);
          }
        };

        try {
          new MutationObserver(function (e) {
            for (var t = e.length, n = 0; n < t; n++) {
              var r = e[n];
              i(r.removedNodes, f), i(r.addedNodes, s);
            }
          }).observe(document, {
            subtree: !0,
            childList: !0
          });
        } catch (e) {
          document.addEventListener("DOMNodeRemoved", function (e) {
            i([e.target], f);
          }, !1), document.addEventListener("DOMNodeInserted", function (e) {
            i([e.target], s);
          }, !1);
        }
      }()), ve.add(t)) : n.toLowerCase() in t && (o = o.toLowerCase()), function (e) {
        i !== e && (i && t.removeEventListener(o, i, !1), (i = e) && t.addEventListener(o, e, !1));
      };
    }

    if ("data" === n || !r && n in t) return function (e) {
      i !== e && (i = e, t[n] !== e && null == (t[n] = e) && t.removeAttribute(n));
    };
    if (n in A.attributes) return function (e) {
      i = A.attributes[n](t, e), t.setAttribute(n, null == i ? "" : i);
    };
    var a = !1,
        u = e.cloneNode(!0);
    return function (e) {
      i !== e && (i = e, u.value !== e && (null == e ? (a && (a = !1, t.removeAttributeNode(u)), u.value = e) : (u.value = e, a || (a = !0, t.setAttributeNode(u)))));
    };
  },
      Ee = function Ee(n) {
    var r = void 0;
    return function e(t) {
      r !== t && ("object" == _typeof(r = t) && t ? ye(t) ? t.then(e) : "placeholder" in t ? we(t, e) : e("text" in t ? String(t.text) : "any" in t ? t.any : "html" in t ? [].concat(t.html).join("") : "length" in t ? Q.call(t).join("") : A.invoke(t, e)) : n.textContent = null == t ? "" : t);
    };
  },
      Ce = {
    create: function create(e, t) {
      for (var n = [], r = t.length, i = 0; i < r; i++) {
        var o = t[i],
            a = ie(e, o.path);

        switch (o.type) {
          case "any":
            n.push(Ne(a, []));
            break;

          case "attr":
            n.push(xe(a, o.name, o.node));
            break;

          case "text":
            n.push(Ee(a)), a.textContent = "";
        }
      }

      return n;
    },
    find: function e(t, n, r) {
      for (var i = t.childNodes, o = i.length, a = 0; a < o; a++) {
        var u = i[a];

        switch (u.nodeType) {
          case 1:
            be(u, n, r), e(u, n, r);
            break;

          case 8:
            u.textContent === b && (r.shift(), n.push(d.test(t.nodeName) ? re("text", t) : re("any", u)));
            break;

          case 3:
            d.test(t.nodeName) && g.call(u.textContent) === h && (r.shift(), n.push(re("text", t)));
        }
      }
    }
  },
      je = !0;

  var Ae = new p(),
      ke = function () {
    try {
      var e = new p(),
          t = Object.freeze([]);
      if (e.set(t, !0), !e.get(t)) throw t;
      return e;
    } catch (t) {
      return new i();
    }
  }();

  function Te(e) {
    var t = Ae.get(this);
    return t && t.template === U(e) ? Oe.apply(t.updates, arguments) : function (e) {
      e = U(e);

      var t = ke.get(e) || function (e) {
        var t = [],
            n = e.join(h).replace(De, Pe),
            r = G(this, n);
        Ce.find(r, t, e.slice());
        var i = {
          fragment: r,
          paths: t
        };
        return ke.set(e, i), i;
      }.call(this, e),
          n = K(this.ownerDocument, t.fragment),
          r = Ce.create(n, t.paths);

      Ae.set(this, {
        template: e,
        updates: r
      }), Oe.apply(r, arguments), this.textContent = "", this.appendChild(n);
    }.apply(this, arguments), this;
  }

  function Oe() {
    for (var e = arguments.length, t = 1; t < e; t++) {
      this[t - 1](arguments[t]);
    }
  }

  var Se,
      Le,
      Me,
      $e,
      De = R,
      Pe = function Pe(e, t, n) {
    return r.test(t) ? e : "<" + t + n + "></" + t + ">";
  },
      Be = new p(),
      Re = function Re(n) {
    var r = void 0,
        i = void 0,
        o = void 0,
        a = void 0,
        u = void 0;
    return function (e) {
      e = U(e);
      var t = a !== e;
      return t && (a = e, o = O(document), i = "svg" === n ? document.createElementNS(c, "svg") : o, u = Te.bind(i)), u.apply(null, arguments), t && ("svg" === n && I(o, Q.call(i.childNodes)), r = He(o)), r;
    };
  },
      _e = function _e(e, t) {
    var n = t.indexOf(":"),
        r = Be.get(e),
        i = t;
    return -1 < n && (i = t.slice(n + 1), t = t.slice(0, n) || "html"), r || Be.set(e, r = {}), r[i] || (r[i] = Re(t));
  },
      He = function He(e) {
    for (var t = e.childNodes, n = t.length, r = [], i = 0; i < n; i++) {
      var o = t[i];
      1 !== o.nodeType && 0 === g.call(o.textContent).length || r.push(o);
    }

    return 1 === r.length ? r[0] : new te(r);
  },
      ze = A.define;

  function Fe(e) {
    return arguments.length < 2 ? null == e ? Re("html") : "string" == typeof e ? Fe.wire(null, e) : "raw" in e ? Re("html")(e) : "nodeType" in e ? Fe.bind(e) : _e(e, "html") : ("raw" in e ? Re("html") : Fe.wire).apply(null, arguments);
  }

  return Fe.Component = w, Fe.bind = function (e) {
    return Te.bind(e);
  }, Fe.define = ze, Fe.diff = he, (Fe.hyper = Fe).wire = function (e, t) {
    return null == e ? Re(t || "html") : _e(e, t || "html");
  }, Se = Re, Le = new p(), Me = Object.create, $e = function $e(e, t) {
    var n = {
      w: null,
      p: null
    };
    return t.set(e, n), n;
  }, Object.defineProperties(w, {
    for: {
      configurable: !0,
      value: function value(e, t) {
        return function (e, t, n, r) {
          var i,
              o,
              a,
              u = t.get(e) || $e(e, t);

          switch (_typeof(r)) {
            case "object":
            case "function":
              var l = u.w || (u.w = new p());
              return l.get(r) || (i = l, o = r, a = new e(n), i.set(o, a), a);

            default:
              var c = u.p || (u.p = Me(null));
              return c[r] || (c[r] = new e(n));
          }
        }(this, Le.get(e) || (n = e, r = new i(), Le.set(n, r), r), e, null == t ? "default" : t);
        var n, r;
      }
    }
  }), Object.defineProperties(w.prototype, {
    handleEvent: {
      value: function value(e) {
        var t = e.currentTarget;
        this["getAttribute" in t && t.getAttribute("data-call") || "on" + e.type](e);
      }
    },
    html: u("html", Se),
    svg: u("svg", Se),
    state: u("state", function () {
      return this.defaultState;
    }),
    defaultState: {
      get: function get() {
        return {};
      }
    },
    dispatch: {
      value: function value(e, t) {
        var n = this._wire$;

        if (n) {
          var r = new CustomEvent(e, {
            bubbles: !0,
            cancelable: !0,
            detail: t
          });
          return r.component = this, (n.dispatchEvent ? n : n.childNodes[0]).dispatchEvent(r);
        }

        return !1;
      }
    },
    setState: {
      value: function value(e, t) {
        var n = this.state,
            r = "function" == typeof e ? e.call(this, n) : e;

        for (var i in r) {
          n[i] = r[i];
        }

        return !1 !== t && this.render(), this;
      }
    }
  }), Fe;
}(window);

var _default = hyperHTML;
exports.default = _default;
var Component = hyperHTML.Component,
    bind = hyperHTML.bind,
    define = hyperHTML.define,
    diff = hyperHTML.diff,
    hyper = hyperHTML.hyper,
    wire = hyperHTML.wire;
exports.wire = wire;
exports.hyper = hyper;
exports.diff = diff;
exports.define = define;
exports.bind = bind;
exports.Component = Component;

},{}],10:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      <h1>Count ", "</h1>\n      <button onclick=", ">+</button>\n      <button onclick=", ">-</button>\n\n      <h3>Hello ", "</h3>\n      <input oninput=", " value=", "/>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _widgets = require("@scoutgg/widgets");

var _hyper = require("@scoutgg/widgets/esm/renderers/hyper");

var _esm = _interopRequireDefault(require("hyperhtml/esm"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

(0, _widgets.define)([(0, _widgets.Component)('demo'), (0, _widgets.Attribute)('name', String), (0, _widgets.Attribute)('count', Number), (0, _widgets.Template)(function (html) {
  var _this = this;

  html(_templateObject(), this.count, this.increment.bind(this), this.decrement.bind(this), this.name, function (e) {
    return _this.name = e.target.value;
  }, this.name);
}),
/*#__PURE__*/
function (_HTMLElement) {
  _inherits(Counter, _HTMLElement);

  function Counter() {
    _classCallCheck(this, Counter);

    return _possibleConstructorReturn(this, _getPrototypeOf(Counter).apply(this, arguments));
  }

  _createClass(Counter, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.count = 0;
    }
  }, {
    key: "increment",
    value: function increment() {
      this.count++;
    }
  }, {
    key: "decrement",
    value: function decrement() {
      this.count--;
    }
  }]);

  return Counter;
}(_wrapNativeSuper(HTMLElement))]);
(0, _widgets.bootstrap)([(0, _hyper.hyper)(_esm.default) // tell widgets how to render component
]);

},{"@scoutgg/widgets":4,"@scoutgg/widgets/esm/renderers/hyper":6,"hyperhtml/esm":9}]},{},[10]);
