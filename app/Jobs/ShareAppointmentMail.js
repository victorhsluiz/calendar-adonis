'use strict'

const Mail = use('Mail')

class ShareAppointmentMail {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'ShareAppointmentMail-job'
  }

  async handle ({ email, username, appointment }) {
    await Mail.send(
      ['emails.share_appointment'],
      { username, appointment },
      message => {
        message
          .to(email)
          .from('victor@email.com', 'Victor')
          .subject(`Evento: ${appointment.title}`)
      }
    )
  }
}

module.exports = ShareAppointmentMail
