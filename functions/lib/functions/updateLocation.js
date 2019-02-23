"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handlers_1 = require("./handlers");
const validators_1 = require("./validators");
const mcdonaldsRestaurants_1 = require("../data/mcdonaldsRestaurants");
const distanceCalculator_1 = require("./utils/distanceCalculator");
exports.default = (functions, admin) => (data, context) => {
    // Uncomment this code if your app has authentication
    // if (!context.auth) {
    // 	return Handlers.triggerAuthorizationError()
    // }
    const { exists } = validators_1.Validators;
    if (!exists(data)) {
        return handlers_1.Handlers.error('Bad request', 'no data', 400);
    }
    const timestamp_now = (new Date()).getTime();
    const locationRef = admin.database().ref(`driver-locations/1234`); //${data.driver_id}
    return locationRef.once('value').then(result => {
        if (result.val() !== null && timestamp_now - result.val().last_update < 15) {
            return handlers_1.Handlers.error('Location update failed', {
                reason: 'Location was updated less than 15s ago',
                time_difference: timestamp_now - result.val().last_update,
            }, 500);
        }
        const closestLocation = (latitude, longitude, mcDonaldsRestaurants) => {
            return mcDonaldsRestaurants.map(restaurant => {
                return Object.assign({}, restaurant, { distance: distanceCalculator_1.CalculateDistance(latitude, longitude, restaurant.location[0], restaurant.location[1]) });
            }).sort((current, next) => current.distance - next.distance);
        };
        console.log('closest', closestLocation(data.latitude, data.longitude, mcdonaldsRestaurants_1.McDonaldsRestaurants));
        const previousLocation = result.val() ? {
            latitude: result.val().latitude,
            longitude: result.val().longitude
        } : {
            latitude: data.latitude,
            longitude: data.longitude
        };
        return locationRef.update({
            latitude: data.latitude,
            longitude: data.longitude,
            previous_latitude: previousLocation.latitude,
            previous_longitude: previousLocation.longitude,
            // closestLocation: closestLocation(data.latitude,data.longitude, McDonaldsRestaurants),
            last_update: timestamp_now
        }).then(() => {
            return handlers_1.Handlers.success('Driver', data.driver_id, 200);
        });
    });
};
//# sourceMappingURL=updateLocation.js.map