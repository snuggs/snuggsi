class TokenList {

  constructor (node) {

    this
      .sift (node)
      .map  (this.tokenize, this)
  }

  tokenize (node) {

    const
      insert = node =>
        symbol =>
          (this [symbol] = this [symbol] || []).push (node)

    void
      (node.text = node.textContent)
        .match (/[^{\}]+(?=})/g)
        .map   (insert (node))
  }

  sift (node) {

    const
      nodes = []
    , expression = /{(\w+|#)}/

    , visit = node =>
        node.nodeType === Node.TEXT_NODE
          ? TEXT_NODE (node)
          : ELEMENT_NODE (node.attributes)
        && NodeFilter.FILTER_REJECT // We don't need 'em

    , TEXT_NODE = node =>
        expression.test (node.textContent)
          && nodes.push (node)

    , ELEMENT_NODE = attrs =>
        [ ... attrs ].map
          (attr => expression.test (attr.value) && nodes.push (attr))

    , walker =
        document.createNodeIterator
          (node, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, visit, null)
          // by default breaks on template YAY! 🎉

    while (walker.nextNode ()) 0 // Walk all nodes and do nothing.

    return nodes
  }

  bind (context) {

    const
      reset = symbol =>
        this [symbol].map // more than one occurrence
          (node => node.textContent = node.text)
        && [symbol, this [symbol]]

   // must both run independently not in tandem

    , restore = ([symbol, nodes]) =>
         nodes.map ( node =>
           node.textContent = node.textContent
             .replace ( ... ['{'+symbol+'}', context [symbol]] ))

    Object
      .keys (this)
      .map  (reset)
      .map  (restore)
  }
}

//function zip (...elements) {
//  const
//    lock = (zipper, row) => [...zipper, ...row]
//  , pair = teeth => // http://english.stackexchange.com/questions/121601/pair-or-couple
//      (tooth, position) => // thunk
//        [tooth, teeth [position]]

//  return elements [1]
//    .map (pair (elements [0]))
//    .reduce (lock)
//}

//function slice (text, tokens = []) {
//  const
//    match    = /({\w+})/g // stored regex is faster https://jsperf.com/regexp-indexof-perf
//  , replace  = token => (collect (token), '✂️')
//  , collect  = token => tokens.push (token)
//  , sections = text
//      .replace (match, replace)
//        .split ('✂️')

//  return zip (tokens, sections)
//        .map (element => element && new Text (element))
//}

// http://nshipster.com/method-swizzling/
// HTMLElement Swizzle - To swizzle a method is to change a class’s dispatch table in order to resolve messages from an existing selector to a different implementation, while aliasing the original method implementation to a new selector.

// 3.2.3 HTML element constructors
// https://html.spec.whatwg.org/multipage/dom.html#html-element-constructors
// Satisfy Element interface document.createElement
//   - https://dom.spec.whatwg.org/#concept-element-interface


//// base class to extend, same trick as before
//class HTMLCustomElement extends HTMLElement {

//  constructor(_)
//    { return (_ = super(_)).init(), _; }

//  init()
//    { /* override as you like */ }
//}

const HTMLElement = (
  constructor => {
    const E = function () {}
    E.prototype = constructor.prototype
    return E
  }
    //E.prototype.constructor = constructor // this only checks for typeof HTMLElement
) (window.HTMLElement)

  // http://w3c.github.io/webcomponents/spec/imports/#h-interface-import

// Preloading -
//   - https://w3c.github.io/preload/

// Markup based async loader
// - <link rel="preload" as="style" href="async_style.css" onload="this.rel='stylesheet'"

void (Element => {

  'loading' === document.readyState

    ? document.addEventListener // could this be `.onload = f()` ?
        ('DOMContentLoaded', preload)

    : preload ()


  function preload () {
    []
      .slice
      .call (document.querySelectorAll ('link[id*="-"]'))
      .map  (load)
  }

  function load (link, xhr) {

    // HTML Imports
    (xhr = new XMLHttpRequest)
      .open ('GET', link.href)

    xhr.responseType = 'document'
    xhr.send ()

    xhr.onload = function (clone) {
      const
        content = this.responseXML

      , next = link.nextSibling

      , template =
          content.querySelector ('template')

      , nodes =
          content.querySelectorAll
            ('style,link[rel=stylesheet],script[type=export]')

      , links =
          document.getElementsByTagName (link.id)

      , stamp = element =>
          element.innerHTML = template.innerHTML

      , reflect =
          node => attr =>
            node [attr] && (clone [attr] = node [attr])

      void []
        .slice
        .call (links)
        .map  (stamp)

      for (let node of nodes)
        (clone = document.createElement (node.tagName))

          // force scripts to run in order
        , clone.async && (clone.async = false)

        , ['rel', 'src', 'href', 'textContent']
            .map (reflect (node))

        , link.parentNode.insertBefore (clone, next)
    }
  }

}) (window.HTMLLinkElement)

// see global-event-handlers.es:onconnect

//function mirror (template, insert) {

//  template = template.cloneNode (true)

//  insert = (replacement, name, slot) =>
//    (name = replacement.getAttribute ('slot')) &&

//    (slot = template.content.querySelector ('slot[name='+name+']'))
//       // prefer to use replaceWith however support is sparse
//       // https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/replaceWith
//       // using `Node.parentNode` - https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode
//       // & `Node.replaceChid` - https://developer.mozilla.org/en-US/docs/Web/API/Node/replaceChild
//       // as is defined in (ancient) W3C DOM Level 1,2,3
//       .parentNode
//       .replaceChild (replacement, slot)

//  for (let replacement of this.selectAll ('[slot]'))
//    insert (replacement)

//  Array
//    .from (template.attributes)

//    // skip swapping attribute if setting exists
//    .filter (attr => !!! this.attributes [attr.name])

//    .map  (attr => this.setAttribute (attr.name, attr.value))

//  this.innerHTML = template.innerHTML
//}

// https://people.cs.pitt.edu/~kirk/cs1501/Pruhs/Spring2006/assignments/editdistance/Levenshtein%20Distance.htm

// https://github.com/WebReflection/hyperHTML/pull/100

// https://skillsmatter.com/skillscasts/10805-an-isomorphic-journey-to-a-lighter-and-blazing-fast-virtual-dom-alternative#video

// https://github.com/webcomponents/template
const Template = HTMLTemplateElement = function (template) {

  template =
    typeof template == 'string'
      ? document.querySelector ('template[name='+template+']')
      : template

  template =
    this === HTMLTemplateElement
      ? template.cloneNode (true)
      : template

  template.name =
    template.getAttribute ('name')

  template.comment =
    document.createComment (template.name)

  template
    .parentNode
    .replaceChild
      (template.comment, template)

  return Object
    .defineProperty
      (template, 'bind', { value: bind })

  function bind (context) {

    let
      html     = ''
    , template = this.innerHTML
    , contexts = [].concat ( ... [context] )
        // https://dom.spec.whatwg.org/#converting-nodes-into-a-node

    const
      keys =
        'object' === typeof contexts [0]
          ? Object.keys (contexts [0])    // memoize keys
          :  []
          .concat (['#', 'self']) // add helper keys

    , tokens =
        keys.map (key => '{'+key+'}') // memoize tokens

    , fragment = // create template polyfill here
        document.createElement ('template')

    , deposit = (context, index) => {
        let clone = template

        context = (typeof context  === 'object')
          ? context : { self: context }

        context ['#'] = index

        for (let i=0; i<tokens.length; i++)
          clone = clone
            .split (tokens [i])
            .join  (context [keys [i]])

        return clone
      }

    void ( this.dependents || [] ).map
      (dependent => dependent.parentNode.removeChild (dependent))

    for (let i=0, final = ''; i<contexts.length; i++)
      html += deposit (contexts [i], i)

    fragment.innerHTML = html

    var children =
      (fragment.content || fragment).childNodes

    this.dependents =
      Array.apply (null, children) // non-live

    this.comment.after
      && this.comment.after ( ... this.dependents )

    !!!  this.comment.after
      && this.dependents.reverse ()
         .map (dependent =>
           this.comment.parentNode.insertBefore
             (dependent, this.comment.nextSibling))
  }
}

// The CustomElementRegistry Interface
// WHATWG - https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-api
//
// HTML Element Constructors
//   - https://html.spec.whatwg.org/multipage/dom.html#html-element-constructors
//
// The Custom Elements Spec
// W3C - https://w3c.github.io/webcomponents/spec/custom/
// WHATWG- https://html.spec.whatwg.org/multipage/custom-elements.htm
//
// Legacy webcomponentsjs
//   - https://github.com/webcomponents/custom-elements/blob/master/src/CustomElementRegistry.js
//
//   - CEReactions
//     - https://github.com/webcomponents/custom-elements/pull/62
//     - https://html.spec.whatwg.org/multipage/custom-elements.html#cereactions
//     - https://html.spec.whatwg.org/#cereactions


!!! window.customElements
  && (window.customElements = {/* microfill */})


new class CustomElementRegistry {

  constructor ({ define, get, whenDefined } = customElements ) {

    window.customElements
      .define = this
        ._define (undefined) // (define)
        .bind (this)
  }

  _define ( delegate = _=> {} ) {

    // this.running = undefined

    //  definition = this.swizzle ( definition );

    return ( name, constructor, options ) =>
      (delegate).apply
        ( window.customElements, this.register ( name, constructor ) )
  }


  register (name, Class) {
    // perhaps this goes in swizzle
    (this [name] = Class)
      .localName = name


    'loading' === document.readyState

      ? document.addEventListener
        ('DOMContentLoaded', this.queue ( ... arguments ))

      : this.queue ( ... arguments )()

    return arguments
  }


  queue ( name, Class, constructor ) {
    return event =>
      // https://www.nczonline.net/blog/2010/09/28/why-is-getelementsbytagname-faster-that-queryselectorall
      [].slice.call (document.getElementsByTagName (name))
        // .reverse () // should be able to do depth first
        .map
          (this.upgrade (Class))
  }


  // https://wiki.whatwg.org/wiki/Custom_Elements#Upgrading
  // "Dmitry's Brain Transplant"
  upgrade (constructor) {

    // Here's where we can swizzle

    return element =>
      Object.setPrototypeOf
        (element, constructor.prototype)

      .connectedCallback
        && element.connectedCallback ()
  }

  // http://nshipster.com/method-swizzling/
  swizzle ( name, ... Class ) { }

}
const ParentNode = Element =>

  // DOM Levels
  // (https://developer.mozilla.org/fr/docs/DOM_Levels)
  //
  // Living Standard HTML5 ParentNode
  // https://dom.spec.whatwg.org/#parentnode
  //
  // MDN ParentNode
  // https://developer.mozilla.org/en-US/docs/Web/API/ParentNode
  //
  // ElementTraversal interface
  // https://www.w3.org/TR/ElementTraversal/#interface-elementTraversal

(class extends Element {

  // http://jsfiddle.net/zaqtg/10
  // https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
  // https://developer.mozilla.org/en-US/docs/Web/API/NodeIterator
  // https://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html
  // https://developer.mozilla.org/en-US/docs/Web/API/NodeFilter
  // NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT

  selectAll ( fragments, ... tokens ) {
    fragments =
      [].concat ( ... [fragments] )

    const
      zip =
        (part, token) =>
          part + token + fragments.shift ()

    , selector =
        tokens.reduce (zip, fragments.shift ())

    return [].slice.call (this.querySelectorAll (selector))
  }

  select ( ... selector )
    // watch out for clobbering `HTMLInputElement.select ()`
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select
    { return this.selectAll ( ... selector ) [0] }

})

//function comb
//  // ElementTraversal interface
//  // https://www.w3.org/TR/ElementTraversal/#interface-elementTraversal
//
//(parent) {
//  if (parent.hasChildNodes())
//    for (let node = parent.firstChild; node; node = node.nextSibling)
//      comb (node)
//}

const EventTarget = HTMLElement => // why buble

  // DOM Levels
  // (https://developer.mozilla.org/fr/docs/DOM_Levels)
  //
  // WHATWG Living Standard HTML5 EventTarget
  // https://dom.spec.whatwg.org/#eventtarget
  //
  // MDN EventTarget
  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
  //
  // DOM Level 3 EventTarget
  // https://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html#Events-EventTarget
  //
  // DOM Level 2 EventTarget
  // (AKA Str🎱  W3C #fockery) ➡️  https://annevankesteren.nl/2016/01/film-at-11
  // 😕  https://w3c.github.io/uievents/DOM3-Events.html#interface-EventTarget
  //❓❓ https://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html
  // https://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html#Events-EventTarget
  // Within https://w3c.github.io/uievents/#conf-interactive-ua
  // EventTarget links to WHATWG - https://dom.spec.whatwg.org/#eventtarget

(class extends HTMLElement {

  // MDN EventTarget.addEventListener
  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
  //
  // WHATWG Living Standard EventTarget.addEventListener
  // https://dom.spec.whatwg.org/#dom-eventtarget-removeeventlistener
  //
  // DOM Level 2 EventTarget.addEventListener
  // https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget-addEventListener


  on ( event, handler ) {

    this.addEventListener
      (event, this.renderable (handler))
  }

  renderable ( handler ) {

    // BIG BUG IN IE!!!
    //
    // https://connect.microsoft.com/IE/feedback/details/790389/event-defaultprevented-returns-false-after-preventdefault-was-called
    //
    // https://github.com/webcomponents/webcomponents-platform/blob/master/webcomponents-platform.js#L16

    return (event, render = true) =>
      (event.prevent = _ =>
         !!! (render = false) && event.preventDefault ())

      && handler.call (this, event) !== false // for `return false`

      && render && this.render () // check render availability
  }

//off (event, listener = 'on' + this [event])
//  // MDN EventTarget.removeEventListener
//  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
//  //
//  // WHATWG Living Standard EventTarget.removeEventListener
//  // https://dom.spec.whatwg.org/#dom-eventtarget-removeeventlistener
//  //
//  // DOM Level 2 EventTarget.removeEventListener
//  // https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget-removeEventListener

//  { this.removeEventListener (event, listener) }

//dispatch (event)
//  // MDN EventTarget.dispatchEvent
//  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
//  //
//  // WHATWG Living Standard EventTarget.dispatchEvent
//  // https://dom.spec.whatwg.org/#dom-eventtarget-dispatchevent
//  //
//  // DOM Level 2 EventTarget.dispatchEvent
//  //  https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget-dispatchEvent

//  { }
})

const GlobalEventHandlers = Element =>

  // Living Standard HTML5 GlobalEventHandlers
  // https://html.spec.whatwg.org/multipage/webappapis.html#globaleventhandlers
  //
  // MDN GlobalEventHandlers
  // https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers
  //
  // MDN on* Events
  // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Event_handlers
  //
  // DOM Level 0
  // This event handling model was introduced by Netscape Navigator,
  // and remains the most cross-browser model as of 2005
  // https://en.wikipedia.org/wiki/DOM_events#DOM_Level_0#DOM_Level_0
  //
  // All Event Handling Models
  // https://en.wikipedia.org/wiki/DOM_events#Event_handling_models
  //
  // Inline Model
  // https://en.wikipedia.org/wiki/DOM_events#Inline_model
  //
  // Traditional Model
  // https://en.wikipedia.org/wiki/DOM_events#Traditional_model
  //
  // Traditional Registration
  // http://www.quirksmode.org/js/events_tradmod.html

(class extends Element {

  onconnect (event, target) {

//  RESERVED FOR IMPORTS WTF IS GOING ON
//  event
//    && event.target
//    && (target = event.target)
//    && this.mirror
//      (target.import.querySelector ('template'))

    this.templates =
      this
        .selectAll ('template[name]')
        .map  (template => new Template (template))

    this.tokens =
      new TokenList (this)

    super.onconnect
      && super.onconnect ()

    return this
  }

  // Reflection - https://en.wikipedia.org/wiki/Reflection_(computer_programming)
  // Type Introspection - https://en.wikipedia.org/wiki/Type_introspection
  //
  // In computing, type introspection is the ability of a program
  // to examine the type or properties of an object at runtime.
  // Some programming languages possess this capability.
  //
  // Introspection should not be confused with reflection,
  // which goes a step further and is the ability for a program to manipulate the values,
  // meta-data, properties and/or functions of an object at runtime.

  reflect (handler) {

    /^on/.test (handler) // `on*`
      && handler // is a W3C event
        in HTMLElement.prototype

      && // automagically delegate event
        this.on ( handler.substr (2), this [handler] )
  }

  register (node) {

    const
      register = (event, handler) =>
        /^on/.test (event)
        // https://www.quirksmode.org/js/events_tradmod.html
        // because under traditional registration the handler value is wrapped in scope `{ onfoo }`
        && ( handler = (/{\s*(\w+)\s*}/.exec (node [event]) || []) [1])
        && ( handler = this [handler] )
        && ( node [event] = this.renderable (handler) )

    void []
      .slice
      .call (node.attributes)
      .map  (attr => attr.name)
      .map  (register)
  }
})
const Custom = Element => // why buble

( class extends // interfaces
  ( ParentNode
  ( EventTarget
  ( GlobalEventHandlers
  ( Element ))))
{
  connectedCallback () {
    console.warn ('Connected', this.localName)

    this.context = {}

    super.initialize
      && super.initialize ()

    Object.getOwnPropertyNames
      (Element.prototype).map
        (this.reflect, this)

    this
      .onconnect ()
      .render    ()
  }


  render () {

    this
      .tokens
      .bind (this)

    this
      .templates
      .map (template =>
        template.bind (this [template.name]))

    void
      [this, ... this.selectAll ('*')]
        .map (this.register, this)

    super.onidle && super.onidle ()
  }

})

// http://2ality.com/2013/09/window.html
// http://tobyho.com/2013/03/13/window-prop-vs-global-var

const Element = (
  Element => {

    const
      E = tag => {

        console.warn ('Setting up Element', tag)

        const constructor =// swizzle
          typeof tag === 'string'
      //    ? HTMLCustomElement
      //    : HTMLElement

          //https://gist.github.com/allenwb/53927e46b31564168a1d
          // https://github.com/w3c/webcomponents/issues/587#issuecomment-271031208
          // https://github.com/w3c/webcomponents/issues/587#issuecomment-254017839

        return klass => // https://en.wikipedia.org/wiki/Higher-order_function

          window.customElements.define
            ( ...  [].concat ( ... [tag] )
              , Custom (klass)
              , { constructor })
      }

    // Assign `window.Element.prototype` in case of feature checking on `Element`
    E.prototype = Element.prototype

    return E

}) (window.Element)

