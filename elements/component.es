const Custom = Element => // why buble

( class extends // interfaces
  ( EventTarget ( ParentNode ( GlobalEventHandlers (Element) )))
{
  constructor () {
    super
      () .initialize ()
  }

  initialize () {
    console.warn ('Anything further is snuggsi')


    let
      descriptions =
        Object
          .getOwnPropertyDescriptors
             (Element.prototype)

    , bind = key =>
        !!! console.warn
          (key, descriptions [key].value, descriptions [key], this[key])

        &&

        'function' === typeof
          descriptions [key].value
            && (this [key] = this [key].bind (this))

    Object
      .keys (descriptions)
      .map  (bind)

    Object
      .getOwnPropertyNames (Element.prototype)
      // POTENTIAL REDUNDANCY
      // Aren't `on` events set up in `.bind` on 20?
      // If so we are `.bind`ing to `this` on two iterations
      // of the same function
      .map (this.reflect, this)

    this.context = {}

    console.warn ('context', this.context)

//  console.log ('super initialize', super.initialize)

    return this
  }


  connectedCallback (link) {
    this.onconnect ()
  }


  render () {
    console.log ('rendering')
    return

    this.tokens.bind (this)


    Array
      .from
        (this.selectAll ('template[name]'))

      .map
        (template => template.getAttribute ('name'))

      .map
        (name => (new Template (name)).bind (this [name]))


    Array
      .from (this.selectAll ('*'))

      .concat ([this])

      .map (this.register, this)


    super.onidle && super.onidle ()
  }


  mirror (template, insert) {

    template = template.cloneNode (true)

    insert = (replacement, name, slot) =>
      (name = replacement.getAttribute ('slot')) &&

      (slot = template.content.querySelector ('slot[name='+name+']'))
         // prefer to use replaceWith however support is sparse
         // https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/replaceWith
         // using `Node.parentNode` - https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode
         // & `Node.replaceChid` - https://developer.mozilla.org/en-US/docs/Web/API/Node/replaceChild
         // as is defined in (ancient) W3C DOM Level 1,2,3
         .parentNode
         .replaceChild (replacement, slot)

    for (let replacement of this.selectAll ('[slot]'))
      insert (replacement)

    Array
      .from (template.attributes)

      // skip swapping attribute if setting exists
      .filter (attr => !!! this.attributes [attr.name])

      .map  (attr => this.setAttribute (attr.name, attr.value))

    this.innerHTML = template.innerHTML
  }
})

