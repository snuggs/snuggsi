module.exports =

class {

  constructor () {
    console.warn ('This CAN be called from initialization')
  }

  static foo (context) {
    console.warn ('THIS SHOULD NEVER GET CALLED!!', context)
  }

  put (context) {
    console.warn ('Wow this is really PUTing!', context)
  }

  patch (context) {
    console.warn ('Wow this is really PATCHing!', context.params)
    console.warn ('This', context.body = 'SHAZAAAAAM!!!!')
  }

  post (context) {
    console.warn ('Wow this is really POSTing!', context)
  }

  delete (context) {
    console.warn ('Wow this is really DELETEing!', context)
  }
}
