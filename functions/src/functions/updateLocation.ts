import { Handlers } from './handlers'
import { Validators } from './validators'
import { Location } from '../interfaces/location.model'
import { Restaurant } from '../interfaces/restaurant.model'
import { McDonaldsRestaurants } from '../data/mcdonaldsRestaurants'

import { CalculateDistance } from './utils/distanceCalculator'
import { NotificationsService } from './sendNotification'

export default (functions, admin) => (data, context) => {

    // Uncomment this code if your app has authentication
    if (!context.auth) {
    	return Handlers.triggerAuthorizationError()
    }
    const { uid } = context.auth

    const {exists} = Validators

    if (!exists(data)) {
        return Handlers.error('Bad request', 'no data', 400)
    }

    const timestamp_now: number = (new Date()).getTime()
    const locationRef = admin.database().ref(`driver-locations/1234`) //${data.driver_id}

    return locationRef.once('value').then(result => {
        if (result.val() !== null && timestamp_now - result.val().last_update < 15) {
          return Handlers.error('Location update failed', {
            reason: 'Location was updated less than 15s ago',
            time_difference: timestamp_now - result.val().last_update,
          }, 500)
        }

        const closestLocation = (latitude, longitude, mcDonaldsRestaurants): Restaurant => {
            return mcDonaldsRestaurants.map(restaurant => {
                return {
                    ...restaurant,
                    distance: CalculateDistance(
                        latitude,
                        longitude,
                        restaurant.location[0],
                        restaurant.location[1]
                    )
                }
            }).sort((current, next) => current.distance - next.distance)[0]
        }

        console.log('closest', closestLocation(data.latitude,data.longitude, McDonaldsRestaurants))
        NotificationsService.sendNotification(admin, uid)
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
            // closestLocation: closestLocation(data.latitude,data.longitude, McDonaldsRestaurants),
            last_update: timestamp_now
        }).then(() => {
            return Handlers.success('Driver', data.driver_id, 200)
        })
    })
}
