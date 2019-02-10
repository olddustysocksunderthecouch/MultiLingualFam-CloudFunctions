"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const handlers_1 = require("./handlers");
const validators_1 = require("./validators");
const axios_1 = require("axios");
exports.default = (functions, admin) => (data, context) => {
    if (!context.auth) {
        return handlers_1.Handlers.triggerAuthorizationError();
    }
    const { exists } = validators_1.Validators;
    if (!exists(data)) {
        return handlers_1.Handlers.error('Bad request', null, 400);
    }
    //REMEMBER TO CHANGE THIS URL WHEN DEPLOYING TO A DIFFERENT ENVIRONMENT
    const postUrl = 'https://otdcpt-knupqa.onthedot.co.za/picup-dev-api/v1/driver/set-location';
    const postQuery = (endPoint, postData) => __awaiter(this, void 0, void 0, function* () {
        return axios_1.default.post(endPoint, postData, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjE4NGM0NWM4ZWJmOGRkYmU1NTY5OTE1YzYzNzk5ZDUxZjMyMzY1OTUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcGljdXAtZGV2IiwiYXVkIjoicGljdXAtZGV2IiwiYXV0aF90aW1lIjoxNTQ1MjIxODQ0LCJ1c2VyX2lkIjoiSkZ4NmlKdHBqUlh0ekxpM2lYOEFTV2RJYVN0MSIsInN1YiI6IkpGeDZpSnRwalJYdHpMaTNpWDhBU1dkSWFTdDEiLCJpYXQiOjE1NDUyMjUxNDUsImV4cCI6MTU0NTIyODc0NSwiZW1haWwiOiJhZHJpYW5Abm9uYWNyZWF0aXZlLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImFkcmlhbkBub25hY3JlYXRpdmUuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.HCVHIhC_5_O4JHLdCBq6gU5jD2g2bEPwlAZqx7q8x7NzUYmTMtlIKITdxeeJqWqSpQUNIZ6fKw2Y_ktZqIsADst2-nND7y_7fdXskYFRrVwixEEPBq7PRYxkGyYdv7juSDjhFKFO4wF4QkWcnIPM09m_Pr0-gCraRSxtea5SefCbWwuJxPMx8vymYzqi9v3-S25-_W2vX2KBoD6SHYzWkNA-dX1u69-rVc84DwN9DAhhxQUJKFI-p4vj45KpXALRh9FRf_I6qE9GD7mkPIjijzabqzEQJCoG4ted-Bgi4870MECdnOYbqgTZtd1R3CEOmaqPjPklgSnwXMMHuYhUkw',
                'Content-Type': 'application/json'
            }
        });
    });
    const timestamp_now = (new Date()).getTime();
    const locationRef = admin.database().ref(`driver-locations/${data.driver_id}`);
    return locationRef.once('value').then(result => {
        if (result.val() !== null && timestamp_now - result.val().last_update < 15000) {
            return handlers_1.Handlers.error('Location update failed', {
                reason: 'Location was updated less than 15s ago',
                time_difference: timestamp_now - result.val().last_update,
            }, 500);
        }
        const previousLocation = result.val() ? {
            latitude: result.val().latitude,
            longitude: result.val().longitude
        } : {
            latitude: data.latitude,
            longitude: data.longitude
        };
        const metadata = JSON.stringify({ metadata: {
                driver_id: data.driver_id,
                timestamp: new Date(timestamp_now).toISOString,
                location: previousLocation
            }
        });
        postQuery(postUrl, metadata)
            .then(() => console.log('this will succeed'))
            .catch(error => console.log(error));
        return locationRef.update({
            latitude: data.latitude,
            longitude: data.longitude,
            previous_latitude: previousLocation.latitude,
            previous_longitude: previousLocation.longitude,
            last_update: timestamp_now
        }).then(() => {
            return handlers_1.Handlers.success('Driver', data.driver_id, 200);
        });
    });
};
//# sourceMappingURL=updateLocation.js.map