(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/node_modules/promise/index.js":[function(require,module,exports){
'use strict';

module.exports = require('./lib/core.js')
require('./lib/done.js')
require('./lib/es6-extensions.js')
require('./lib/node-extensions.js')
},{"./lib/core.js":"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/node_modules/promise/lib/core.js","./lib/done.js":"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/node_modules/promise/lib/done.js","./lib/es6-extensions.js":"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/node_modules/promise/lib/es6-extensions.js","./lib/node-extensions.js":"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/node_modules/promise/lib/node-extensions.js"}],"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/node_modules/promise/lib/core.js":[function(require,module,exports){
'use strict';

var asap = require('asap')

module.exports = Promise;
function Promise(fn) {
  if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new')
  if (typeof fn !== 'function') throw new TypeError('not a function')
  var state = null
  var value = null
  var deferreds = []
  var self = this

  this.then = function(onFulfilled, onRejected) {
    return new self.constructor(function(resolve, reject) {
      handle(new Handler(onFulfilled, onRejected, resolve, reject))
    })
  }

  function handle(deferred) {
    if (state === null) {
      deferreds.push(deferred)
      return
    }
    asap(function() {
      var cb = state ? deferred.onFulfilled : deferred.onRejected
      if (cb === null) {
        (state ? deferred.resolve : deferred.reject)(value)
        return
      }
      var ret
      try {
        ret = cb(value)
      }
      catch (e) {
        deferred.reject(e)
        return
      }
      deferred.resolve(ret)
    })
  }

  function resolve(newValue) {
    try { //Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.')
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then
        if (typeof then === 'function') {
          doResolve(then.bind(newValue), resolve, reject)
          return
        }
      }
      state = true
      value = newValue
      finale()
    } catch (e) { reject(e) }
  }

  function reject(newValue) {
    state = false
    value = newValue
    finale()
  }

  function finale() {
    for (var i = 0, len = deferreds.length; i < len; i++)
      handle(deferreds[i])
    deferreds = null
  }

  doResolve(fn, resolve, reject)
}


function Handler(onFulfilled, onRejected, resolve, reject){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null
  this.onRejected = typeof onRejected === 'function' ? onRejected : null
  this.resolve = resolve
  this.reject = reject
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, onFulfilled, onRejected) {
  var done = false;
  try {
    fn(function (value) {
      if (done) return
      done = true
      onFulfilled(value)
    }, function (reason) {
      if (done) return
      done = true
      onRejected(reason)
    })
  } catch (ex) {
    if (done) return
    done = true
    onRejected(ex)
  }
}

},{"asap":"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/node_modules/promise/node_modules/asap/asap.js"}],"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/node_modules/promise/lib/done.js":[function(require,module,exports){
'use strict';

var Promise = require('./core.js')
var asap = require('asap')

module.exports = Promise
Promise.prototype.done = function (onFulfilled, onRejected) {
  var self = arguments.length ? this.then.apply(this, arguments) : this
  self.then(null, function (err) {
    asap(function () {
      throw err
    })
  })
}
},{"./core.js":"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/node_modules/promise/lib/core.js","asap":"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/node_modules/promise/node_modules/asap/asap.js"}],"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/node_modules/promise/lib/es6-extensions.js":[function(require,module,exports){
'use strict';

//This file contains the ES6 extensions to the core Promises/A+ API

var Promise = require('./core.js')
var asap = require('asap')

module.exports = Promise

/* Static Functions */

function ValuePromise(value) {
  this.then = function (onFulfilled) {
    if (typeof onFulfilled !== 'function') return this
    return new Promise(function (resolve, reject) {
      asap(function () {
        try {
          resolve(onFulfilled(value))
        } catch (ex) {
          reject(ex);
        }
      })
    })
  }
}
ValuePromise.prototype = Promise.prototype

var TRUE = new ValuePromise(true)
var FALSE = new ValuePromise(false)
var NULL = new ValuePromise(null)
var UNDEFINED = new ValuePromise(undefined)
var ZERO = new ValuePromise(0)
var EMPTYSTRING = new ValuePromise('')

Promise.resolve = function (value) {
  if (value instanceof Promise) return value

  if (value === null) return NULL
  if (value === undefined) return UNDEFINED
  if (value === true) return TRUE
  if (value === false) return FALSE
  if (value === 0) return ZERO
  if (value === '') return EMPTYSTRING

  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then
      if (typeof then === 'function') {
        return new Promise(then.bind(value))
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex)
      })
    }
  }

  return new ValuePromise(value)
}

Promise.all = function (arr) {
  var args = Array.prototype.slice.call(arr)

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([])
    var remaining = args.length
    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then
          if (typeof then === 'function') {
            then.call(val, function (val) { res(i, val) }, reject)
            return
          }
        }
        args[i] = val
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex)
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i])
    }
  })
}

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) { 
    reject(value);
  });
}

Promise.race = function (values) {
  return new Promise(function (resolve, reject) { 
    values.forEach(function(value){
      Promise.resolve(value).then(resolve, reject);
    })
  });
}

/* Prototype Methods */

Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
}

},{"./core.js":"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/node_modules/promise/lib/core.js","asap":"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/node_modules/promise/node_modules/asap/asap.js"}],"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/node_modules/promise/lib/node-extensions.js":[function(require,module,exports){
'use strict';

//This file contains then/promise specific extensions that are only useful for node.js interop

var Promise = require('./core.js')
var asap = require('asap')

module.exports = Promise

/* Static Functions */

Promise.denodeify = function (fn, argumentCount) {
  argumentCount = argumentCount || Infinity
  return function () {
    var self = this
    var args = Array.prototype.slice.call(arguments)
    return new Promise(function (resolve, reject) {
      while (args.length && args.length > argumentCount) {
        args.pop()
      }
      args.push(function (err, res) {
        if (err) reject(err)
        else resolve(res)
      })
      var res = fn.apply(self, args)
      if (res && (typeof res === 'object' || typeof res === 'function') && typeof res.then === 'function') {
        resolve(res)
      }
    })
  }
}
Promise.nodeify = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments)
    var callback = typeof args[args.length - 1] === 'function' ? args.pop() : null
    var ctx = this
    try {
      return fn.apply(this, arguments).nodeify(callback, ctx)
    } catch (ex) {
      if (callback === null || typeof callback == 'undefined') {
        return new Promise(function (resolve, reject) { reject(ex) })
      } else {
        asap(function () {
          callback.call(ctx, ex)
        })
      }
    }
  }
}

Promise.prototype.nodeify = function (callback, ctx) {
  if (typeof callback != 'function') return this

  this.then(function (value) {
    asap(function () {
      callback.call(ctx, null, value)
    })
  }, function (err) {
    asap(function () {
      callback.call(ctx, err)
    })
  })
}

},{"./core.js":"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/node_modules/promise/lib/core.js","asap":"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/node_modules/promise/node_modules/asap/asap.js"}],"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/node_modules/promise/node_modules/asap/asap.js":[function(require,module,exports){
(function (process){

// Use the fastest possible means to execute a task in a future turn
// of the event loop.

// linked list of tasks (single, with head node)
var head = {task: void 0, next: null};
var tail = head;
var flushing = false;
var requestFlush = void 0;
var isNodeJS = false;

function flush() {
    /* jshint loopfunc: true */

    while (head.next) {
        head = head.next;
        var task = head.task;
        head.task = void 0;
        var domain = head.domain;

        if (domain) {
            head.domain = void 0;
            domain.enter();
        }

        try {
            task();

        } catch (e) {
            if (isNodeJS) {
                // In node, uncaught exceptions are considered fatal errors.
                // Re-throw them synchronously to interrupt flushing!

                // Ensure continuation if the uncaught exception is suppressed
                // listening "uncaughtException" events (as domains does).
                // Continue in next event to avoid tick recursion.
                if (domain) {
                    domain.exit();
                }
                setTimeout(flush, 0);
                if (domain) {
                    domain.enter();
                }

                throw e;

            } else {
                // In browsers, uncaught exceptions are not fatal.
                // Re-throw them asynchronously to avoid slow-downs.
                setTimeout(function() {
                   throw e;
                }, 0);
            }
        }

        if (domain) {
            domain.exit();
        }
    }

    flushing = false;
}

if (typeof process !== "undefined" && process.nextTick) {
    // Node.js before 0.9. Note that some fake-Node environments, like the
    // Mocha test runner, introduce a `process` global without a `nextTick`.
    isNodeJS = true;

    requestFlush = function () {
        process.nextTick(flush);
    };

} else if (typeof setImmediate === "function") {
    // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
    if (typeof window !== "undefined") {
        requestFlush = setImmediate.bind(window, flush);
    } else {
        requestFlush = function () {
            setImmediate(flush);
        };
    }

} else if (typeof MessageChannel !== "undefined") {
    // modern browsers
    // http://www.nonblocking.io/2011/06/windownexttick.html
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    requestFlush = function () {
        channel.port2.postMessage(0);
    };

} else {
    // old browsers
    requestFlush = function () {
        setTimeout(flush, 0);
    };
}

function asap(task) {
    tail = tail.next = {
        task: task,
        domain: isNodeJS && process.domain,
        next: null
    };

    if (!flushing) {
        flushing = true;
        requestFlush();
    }
};

module.exports = asap;


}).call(this,require('_process'))
},{"_process":"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js"}],"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/src/dom.js":[function(require,module,exports){
var dom = {};

module.exports = dom;

/**
 * @param {string} name
 * @return {Element}
 */
dom.createElement = function (name) {
  return document.createElement(name);
};

/**
 * @param {string} text
 * @return {Text}
 */
dom.createText = function (text) {
  return document.createTextNode(text);
};

/**
 * @param {Element} element
 * @param {string} style
 */
dom.style = function (element, style) {
  element.style.cssText = style;
};

/**
 * @param {Node} parent
 * @param {Node} child
 */
dom.append = function (parent, child) {
  parent.appendChild(child);
};

/**
 * @param {Node} parent
 * @param {Node} child
 */
dom.remove = function (parent, child) {
  parent.removeChild(child);
};

},{}],"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/src/observer.js":[function(require,module,exports){
var Promise = require('promise');
var dom = require('./dom');
var Ruler = require('./ruler');

/**
 * @constructor
 *
 * @param {string} family
 * @param [fontface.Descriptors] descriptors
 */
var Observer = function (family, descriptors) {
  descriptors = descriptors || {weight: 'normal'};

  /**
   * @type {string}
   */
  this['family'] = family;

  /**
   * @type {string}
   */
  this['style'] = descriptors.style || 'normal';

  /**
   * @type {string}
   */
  this['variant'] = descriptors.variant || 'normal';

  /**
   * @type {string}
   */
  this['weight'] = descriptors.weight || 'normal';

  /**
   * @type {string}
   */
  this['stretch'] = descriptors.stretch || 'stretch';

  /**
   * @type {string}
   */
  this['featureSettings'] = descriptors.featureSettings || 'normal';
};

module.exports = Observer;

/**
 * @type {null|boolean}
 */
Observer.HAS_WEBKIT_FALLBACK_BUG = null;

/**
 * @type {number}
 */
Observer.DEFAULT_TIMEOUT = 3000;

/**
 * @return {string}
 */
Observer.getUserAgent = function () {
  return window.navigator.userAgent;
};

/**
 * Returns true if this browser is WebKit and it has the fallback bug
 * which is present in WebKit 536.11 and earlier.
 *
 * @return {boolean}
 */
Observer.hasWebKitFallbackBug = function () {
  if (Observer.HAS_WEBKIT_FALLBACK_BUG === null) {
    var match = /AppleWeb[kK]it\/([0-9]+)(?:\.([0-9]+))/.exec(Observer.getUserAgent());

    Observer.HAS_WEBKIT_FALLBACK_BUG = !!match &&
                                        (parseInt(match[1], 10) < 536 ||
                                         (parseInt(match[1], 10) === 536 &&
                                          parseInt(match[2], 10) <= 11));
  }
  return Observer.HAS_WEBKIT_FALLBACK_BUG;
};

/**
 * @private
 * @return {string}
 */
Observer.prototype.getStyle = function () {
  return 'font-style:' + this['style'] + ';' +
         'font-variant:' + this['variant'] + ';' +
         'font-weight:' + this['weight'] + ';' +
         'font-stretch:' + this['stretch'] + ';' +
         'font-feature-settings:' + this['featureSettings'] + ';' +
         '-moz-font-feature-settings:' + this['featureSettings'] + ';' +
         '-webkit-font-feature-settings:' + this['featureSettings'] + ';';
};

/**
 * @param {string=} text Optional test string to use for detecting if a font is available.
 * @param {number=} timeout Optional timeout for giving up on font load detection and rejecting the promise (defaults to 3 seconds).
 * @return {Promise.<fontface.Observer>}
 */
Observer.prototype.check = function (text, timeout) {
  var testString = text || 'BESbswy',
      timeoutValue = timeout || Observer.DEFAULT_TIMEOUT,
      style = this.getStyle(),
      container = dom.createElement('div'),

      rulerA = new Ruler(testString),
      rulerB = new Ruler(testString),
      rulerC = new Ruler(testString),

      widthA = -1,
      widthB = -1,
      widthC = -1,

      fallbackWidthA = -1,
      fallbackWidthB = -1,
      fallbackWidthC = -1,

      that = this;

  rulerA.setFont('sans-serif', style);
  rulerB.setFont('serif', style);
  rulerC.setFont('monospace', style);

  dom.append(container, rulerA.getElement());
  dom.append(container, rulerB.getElement());
  dom.append(container, rulerC.getElement());

  dom.append(document.body, container);

  fallbackWidthA = rulerA.getWidth();
  fallbackWidthB = rulerB.getWidth();
  fallbackWidthC = rulerC.getWidth();

  return new Promise(function (resolve, reject) {
    /**
     * @private
     */
    function removeContainer() {
      if (container.parentNode !== null) {
        dom.remove(document.body, container);
      }
    }

    /**
     * @private
     *
     * Cases:
     * 1) Font loads: both a, b and c are called and have the same value.
     * 2) Font fails to load: resize callback is never called and timeout happens.
     * 3) WebKit bug: both a, b and c are called and have the same value, but the
     *    values are equal to one of the last resort fonts, we ignore this and
     *    continue waiting until we get new values (or a timeout).
     */
    function check() {
      if (widthA !== -1 && widthB !== -1 && widthC !== -1) {
        // All values are changed from their initial state

        if (widthA === widthB && widthB === widthC) {
          // All values are the same, so the browser has most likely loaded the web font

          if (Observer.hasWebKitFallbackBug()) {
            // Except if the browser has the WebKit fallback bug, in which case we check to see if all
            // values are set to one of the last resort fonts.

            if (!((widthA === fallbackWidthA && widthB === fallbackWidthA && widthC === fallbackWidthA) ||
                  (widthA === fallbackWidthB && widthB === fallbackWidthB && widthC === fallbackWidthB) ||
                  (widthA === fallbackWidthC && widthB === fallbackWidthC && widthC === fallbackWidthC))) {
              // The width we got doesn't match any of the known last resort fonts, so let's assume fonts are loaded.
              removeContainer();
              resolve(that);
            }
          } else {
            removeContainer();
            resolve(that);
          }
        }
      }
    }

    setTimeout(function () {
      removeContainer();
      reject(that);
    }, timeoutValue);

    rulerA.onResize(function (width) {
      widthA = width;
      check();
    });

    rulerA.setFont(that['family'] + ',sans-serif', style);

    rulerB.onResize(function (width) {
      widthB = width;
      check();
    });

    rulerB.setFont(that['family'] + ',serif', style);

    rulerC.onResize(function (width) {
      widthC = width;
      check();
    });

    rulerC.setFont(that['family'] + ',monospace', style);
  });
};

},{"./dom":"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/src/dom.js","./ruler":"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/src/ruler.js","promise":"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/node_modules/promise/index.js"}],"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/src/ruler.js":[function(require,module,exports){
var dom = require('./dom');

/**
 * @constructor
 * @param {string} text
 */
var Ruler = function (text) {
  var style = 'display:inline-block;' +
    'position:absolute;' +
    'height:100%;' +
    'width:100%;' +
    'overflow:scroll;';

  this.element = dom.createElement('div');
  this.element.setAttribute('aria-hidden', 'true');

  dom.append(this.element, dom.createText(text));

  this.collapsible = dom.createElement('span');
  this.expandable = dom.createElement('span');
  this.collapsibleInner = dom.createElement('span');
  this.expandableInner = dom.createElement('span');

  this.lastOffsetWidth = -1;

  dom.style(this.collapsible, style);
  dom.style(this.expandable, style);
  dom.style(this.expandableInner, style);
  dom.style(this.collapsibleInner, 'display:inline-block;width:200%;height:200%;');

  dom.append(this.collapsible, this.collapsibleInner);
  dom.append(this.expandable, this.expandableInner);

  dom.append(this.element, this.collapsible);
  dom.append(this.element, this.expandable);
};

module.exports = Ruler;

/**
 * @return {Element}
 */
Ruler.prototype.getElement = function () {
  return this.element;
};

/**
 * @param {string} family
 * @param {string} description
 */
Ruler.prototype.setFont = function (family, description) {
  dom.style(this.element, 'min-width:20px;' +
            'min-height:20px;' +
            'display:inline-block;' +
            'position:absolute;' +
            'width:auto;' +
            'margin:0;' +
            'padding:0;' +
            'top:-999px;' +
            'left:-999px;' +
            'white-space:nowrap;' +
            'font-size:100px;' +
            'font-family:' + family + ';' +
            description);
};

/**
 * @return {number}
 */
Ruler.prototype.getWidth = function () {
  return this.element.offsetWidth;
};

/**
 * @param {string} width
 */
Ruler.prototype.setWidth = function (width) {
  this.element.style.width = width + 'px';
};

/**
 * @private
 *
 * @return {boolean}
 */
Ruler.prototype.reset = function () {
  var offsetWidth = this.getWidth(),
    width = offsetWidth + 100;

  this.expandableInner.style.width = width + 'px';
  this.expandable.scrollLeft = width;
  this.collapsible.scrollLeft = this.collapsible.scrollWidth + 100;

  if (this.lastOffsetWidth !== offsetWidth) {
    this.lastOffsetWidth = offsetWidth;
    return true;
  } else {
    return false;
  }
};

/**
 * @private
 * @param {function(number)} callback
 */
Ruler.prototype.onScroll = function (callback) {
  if (this.reset() && this.element.parentNode !== null) {
    callback(this.lastOffsetWidth);
  }
};

/**
 * @param {function(number)} callback
 */
Ruler.prototype.onResize = function (callback) {
  var that = this;

  this.collapsible.addEventListener('scroll', function () {
    that.onScroll(callback);
  }, false);
  this.expandable.addEventListener('scroll', function () {
    that.onScroll(callback);
  }, false);
  this.reset();
};

},{"./dom":"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/src/dom.js"}],"/Users/cvig/dev/teespring/font-test/src/main.js":[function(require,module,exports){
var FontFaceObserver = require('font-face-observer');

var baseFontPath = 'http://d1b2zzpxewkr9z.cloudfront.net/webfonts/';
var fonts = [
  {
    name: 'cloisterblack',
    file: 'cloisterblack-webfont.woff'
  },
  {
    name: 'russian',
    file: 'russian-webfont.woff'
  },
  {
    name: 'altehaasgrotesk',
    file: 'altehaasgrotesk-webfont.woff'
  },
  {
    name: 'goudybookletter',
    file: 'goudybookletter-webfont.woff'
  }
];


// populate font select list

var fontSelect = document.getElementById('font');

fonts.forEach(function(f) {
  var option = document.createElement('option');
  option.innerText = f.name;
  option.setAttribute('value', f.file);
  fontSelect.appendChild(option);
});


// have UI show document.fonts.status

var fontStatus = document.getElementById('status');

setInterval(function() {
  fontStatus.innerText = document.fonts.status;
}, 25);


// add font-face programatically

function addFontFace(fontFamily, url) {
  var style = document.createElement('style');
  // using local per bulletproof font face: http://www.paulirish.com/2009/bulletproof-font-face-implementation-syntax/
  style.innerText = '@font-face { font-family: "' + fontFamily + '"; src: local("☺︎"), url(' + url + ') format("woff"); }';
  document.head.appendChild(style);
}


// load font and update rendered text to use font after it has loaded

var renderedOutput = document.getElementById('rendered');

fontSelect.addEventListener('change', function() {
  var fontName = fontSelect.options[fontSelect.selectedIndex].text;
  var url = baseFontPath + fontSelect.value;

  addFontFace(fontName, url);

  new FontFaceObserver(fontName).check().then(
    function() {
      renderedOutput.style['font-family'] = fontName;
    },
    function() {
      alert('font failed to load:', fontName);
    }
  );
}, false);

},{"font-face-observer":"/Users/cvig/dev/teespring/font-test/node_modules/font-face-observer/src/observer.js"}],"/usr/local/lib/node_modules/watchify/node_modules/browserify/node_modules/process/browser.js":[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}]},{},["/Users/cvig/dev/teespring/font-test/src/main.js"]);
