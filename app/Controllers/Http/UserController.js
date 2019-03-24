'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class UserController {
  async store ({ request }) {
    const data = request.only(['username', 'email', 'password'])

    const user = await User.create(data)

    return user
  }

  async update ({ request, response, auth }) {
    const data = request.only(['username', 'password_old', 'password'])

    if (data.password_old) {
      const match = await Hash.verify(data.password_old, auth.user.password)

      if (!match) {
        return response.status(401).send({
          error: {
            message: 'A senha antiga está incorreta'
          }
        })
      }

      if (!data.password) {
        return response.status(401).send({
          error: {
            message: 'Informe a nova senha'
          }
        })
      }

      delete data.password_old
    }

    if (!data.password) {
      delete data.password
    }

    auth.user.merge(data)

    await auth.user.save()

    return auth.user
  }
}

module.exports = UserController
