'use strict'

class SessionController {
  async store ({ request, response, auth }) {
    try {
      const { email, password } = request.all()

      const token = await auth.attempt(email, password)

      return token
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'E-mail/senha inválido(s)' } })
    }
  }
}

module.exports = SessionController
