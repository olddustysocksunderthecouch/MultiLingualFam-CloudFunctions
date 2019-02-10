'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const functions_1 = require("./functions");
admin.initializeApp();
exports.updateLocation = functions.https.onCall(functions_1.updateLocation(functions, admin));
//# sourceMappingURL=index.js.map