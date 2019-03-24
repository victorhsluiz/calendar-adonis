'use strict'

const Antl = use('Antl')

const { rule } = use('Validator')

class Update {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      date: [rule('date_format', 'YYYY-MM-DD HH:mm:ss')]
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = Update
