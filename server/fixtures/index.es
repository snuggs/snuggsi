module.exports =

class {

  initialize () {
    console.warn ('This CAN be called from initialization')
  }

  foo (context) {
    console.warn ('THIS SHOULD NEVER GET CALLED!!', context)
  }

  get (context) {
    console.warn ('Wow this is really GETing!', context)
  }

  put (context) {
    console.warn ('Wow this is really PUTing!', context)
  }

  patch (context) {
    console.warn ('Wow this is really PATCHing!', context)
  }

  post (context) {
    console.warn ('Wow this is really POSTing!', context)
  }

  delete (context) {
    console.warn ('Wow this is really DELETEing!', context)
  }
}
