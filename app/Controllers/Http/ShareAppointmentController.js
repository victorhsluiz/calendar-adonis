'use strict'

const Appointment = use('App/Models/Appointment')
const Kue = use('Kue')
const Job = use('App/Jobs/ShareAppointmentMail')

class ShareAppointmentController {
  async share ({ request, response, params, auth }) {
    const appointment = await Appointment.findOrFail(params.appointments_id)
    const email = request.input('email')

    if (appointment.user_id !== auth.user.id) {
      return response.status(401).send({
        error: {
          message: 'Você não tem autorização para compartilhar este evento'
        }
      })
    }

    Kue.dispatch(
      Job.key,
      { email, username: auth.user.username, appointment },
      { attempts: 3 }
    )

    return email
  }
}

module.exports = ShareAppointmentController
