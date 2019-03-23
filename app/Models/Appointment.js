'use strict'

const Model = use('Model')

class Appointment extends Model {
  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Appointment
