'use strict'

const Appointment = use('App/Models/Appointment')
const moment = require('moment')

class AppointmentController {
  async index ({ request }) {
    const { page, date } = request.get()

    let query = Appointment.query().with('user')

    if (date) {
      query = query.whereRaw(`"date"::date = ?`, date)
    }

    const appointments = await query.paginate(page)

    return appointments
  }

  async store ({ request, response, auth }) {
    const data = request.only(['title', 'location', 'date'])

    try {
      await Appointment.findByOrFail('date', data.date)

      return response.status(401).send({
        error: {
          message: 'Não é possível definir dois compromissos no mesmo horário.'
        }
      })
    } catch (error) {
      const appointment = await Appointment.create({
        ...data,
        user_id: auth.user.id
      })
      return appointment
    }
  }

  async show ({ params, request, response, auth }) {
    const appointment = await Appointment.findOrFail(params.id)

    if (appointment.user_id !== auth.user.id) {
      return response.status(401).send({
        error: {
          message:
            'Os compromissos só podem ser visualizados pelo próprio criador'
        }
      })
    }

    return appointment
  }

  async update ({ params, request, response, auth }) {
    const appointment = await Appointment.findOrFail(params.id)

    if (appointment.user_id !== auth.user.id) {
      return response.status(401).send({
        error: {
          message: 'Apenas o criador do compromisso pode edita-lo.'
        }
      })
    }

    const happened = moment().isAfter(appointment.date)

    if (happened) {
      return response.status(401).send({
        error: {
          message: 'Compromissos já realizados não podem ser editados.'
        }
      })
    }

    const data = request.only(['title', 'location', 'date'])

    try {
      const appointment = await Appointment.findByOrFail('date', data.date)
      if (appointment.id !== Number(params.id)) {
        return response.status(401).send({
          error: {
            message:
              'Não é possível definir dois compromissos no mesmo horário.'
          }
        })
      }
    } catch (err) {}

    appointment.merge(data)

    await appointment.save()

    return appointment
  }

  async destroy ({ params, response, auth }) {
    const appointment = await Appointment.findOrFail(params.id)

    if (appointment.user_id !== auth.user.id) {
      return response.status(401).send({
        error: {
          message: 'Apenas o criador do compromisso pode efetuar essa operação.'
        }
      })
    }

    const happened = moment().isAfter(appointment.date)

    if (happened) {
      return response.status(401).send({
        error: {
          message: 'Compromissos já realizados não podem ser excluídos.'
        }
      })
    }

    await appointment.delete()
  }
}

module.exports = AppointmentController
