var ElementPrototype = window.Element.prototype // see bottom of this file

const Element = function
// Custom elements polyfill
// https://github.com/webcomponents/custom-elements/blob/master/src/custom-elements.js
// https://github.com/w3c/webcomponents/issues/587#issuecomment-271031208
// https://github.com/w3c/webcomponents/issues/587#issuecomment-254017839
// Function.name - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name#Examples
//https://gist.github.com/allenwb/53927e46b31564168a1d

(tag = Array.isArray (arguments [0]) ? arguments [0][0] : arguments [0], registry = window.customElements) {

  return function // https://en.wikipedia.org/wiki/Higher-order_function
    (prototype, self = ! (this === window) ? this : {})
  { // Should this be a class❓❓❓❓

    try
      { if (! prototype) return new registry.get (tag) }

    catch (_)
      { throw 'Must define custom element \n(i.e. Element `'+tag+'` (class {})' }

    class HTMLCustomElement extends // mixins
      (GlobalEventHandlers (EventTarget (ParentNode (prototype))))
    { // exotic object - https://github.com/whatwg/html/issues/1704

      constructor   () { super () && super.initialize && super.initialize () }

      get context   () { return self }
      get templates () { return this.selectAll ('template') }

      render (selector) {
        const
          node = selector ? this.select (selector) : this
        , template = super.render && super.render (selector) // or a bonafied Template
      }
    }

    try
      { registry.define (tag, HTMLCustomElement) }

    finally
      { return registry.get (tag) }
  }
}

// Assign `window.Element.prototype` in case of feature checking on `Element`
Element.prototype = window.Element.prototype
  // http://2ality.com/2013/09/window.html
  // http://tobyho.com/2013/03/13/window-prop-vs-global-var
  // https://github.com/webcomponents/webcomponentsjs/blob/master/webcomponents-es5-loader.js#L19
