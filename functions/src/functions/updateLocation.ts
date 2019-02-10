import { Handlers } from './handlers'
import { Validators } from './validators'
import { Location } from '../interfaces/location.model'

export default (functions, admin) => (data, context) => {

  if (!context.auth) {
		return Handlers.triggerAuthorizationError()
  }

  const { exists } = Validators

  if(!exists(data)) {
    return Handlers.error('Bad request', 'no data', 400)
  }

  const timestamp_now: number = (new Date()).getTime()
  const locationRef = admin.database().ref(`driver-locations/${data.driver_id}`)

  return locationRef.once('value').then(result => {
    if (result.val() !== null && timestamp_now - result.val().last_update < 15000) {
      return Handlers.error('Location update failed', {
        reason: 'Location was updated less than 15s ago',
        time_difference: timestamp_now - result.val().last_update,
      }, 500)
    }

    const previousLocation: Location = result.val() ? {
      latitude: result.val().latitude,
      longitude: result.val().longitude
    } : {
      latitude: data.latitude,
      longitude: data.longitude
    }

    return locationRef.update({
      latitude: data.latitude,
      longitude: data.longitude,
      previous_latitude: previousLocation.latitude,
      previous_longitude: previousLocation.longitude,
      last_update: timestamp_now
    }).then(() => {
      return Handlers.success('Driver', data.driver_id, 200)
    })
  })
}
