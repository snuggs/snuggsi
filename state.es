// ONLY UPDATES CHANGED PROPERTY
// Also we don't add a <span> around changed fields.
// Does React still do this? https://www.youtube.com/watch?v=qh3dYM6Keuw
//
// https://en.wikipedia.org/wiki/Immutable_object
// https://en.wikipedia.org/wiki/Persistent_data_structure
function State ( context, handler = _ => {} ) {
  this.subscribe = callback => handler = callback

  const
    history = new Array (context)
  , clone   = context => JSON.parse
      (JSON.stringify (context))

  , thunk = property =>
      [ property,
        {
          get: _ => history
            [history.length-1] [property],

          set (value) {
            const next  = clone
              (previous = history [history.length-1])

            next [property] = value
            handler (previous, next)
            history [history.length] = next
          }
        }
      ]

  for (property in context)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects
    Object.defineProperty (this, ...thunk (property))
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties
}
