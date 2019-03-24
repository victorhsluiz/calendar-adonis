'use strict'

const Route = use('Route')

Route.post('users', 'UserController.store').validator('User')

Route.post('sessions', 'SessionController.store').validator('Session')

Route.post('passwords', 'ForgotPasswordController.store').validator(
  'ForgotPassword'
)
Route.put('passwords', 'ForgotPasswordController.update').validator(
  'ResetPassword'
)

Route.group(() => {
  Route.resource('appointments', 'AppointmentController')
    .apiOnly()
    .validator(
      new Map([
        [['appointments.store'], ['StoreAppointment']],
        [['appointments.update'], ['UpdateAppointment']]
      ])
    )

  Route.delete('appointments/:id', 'ShareAppointmentController.destroy')

  Route.post(
    'appointments/:appointments_id/share',
    'ShareAppointmentController.share'
  ).validator('ShareAppointment')

  Route.put('users/:id', 'UserController.update').validator('UserUpdate')
}).middleware('auth')
