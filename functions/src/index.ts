'use strict'

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { updateLocation } from './functions'

admin.initializeApp()

exports.updateLocation = functions.https.onCall(updateLocation(functions, admin))