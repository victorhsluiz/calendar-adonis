'use strict'

const Antl = use('Antl')

class Store {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      username: 'required|unique:users',
      password: 'confirmed'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Store
