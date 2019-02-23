'use strict'

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {addDeviceToken, updateLocation} from './functions'

admin.initializeApp()

exports.addDeviceToken = functions.https.onCall(addDeviceToken(functions, admin))
exports.updateLocation = functions.https.onCall(updateLocation(functions, admin))
