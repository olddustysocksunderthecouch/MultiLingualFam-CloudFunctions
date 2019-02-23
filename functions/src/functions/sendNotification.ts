import { Handlers } from './handlers'

export const NotificationsService = {
  sendNotification: (admin: any, uid: string) => {
    const databaseReference = (path: string) => admin.database().ref(path)

    try {
      const payload = {
        notification: {
          title: 'Xhosa Phrase Suggestion',
          body: 'Open the app to see the suggestion',
          android_channel_id: 'isiXhosa',
          tag: 'isiXhosa',
        }
      }

      const sendNotificationToIndividual = async (recipientUID: string) => {
        try {
          const tokens = await databaseReference(`/device_tokens/${recipientUID}`).once('value')
          const tokenSnapshot = tokens.val()

          if (!tokenSnapshot) {
            return Handlers.success('No device tokens', {}, 204)
          }

          const tokensArray = Object.keys(tokenSnapshot)
          console.log('tokens array', tokensArray)
          const response = await admin.messaging().sendToDevice(tokensArray[0], payload) // only to one

          response.results.forEach((result, index) => {
            const error = result.error
            console.warn(result, error)
            const tokenErrorPossibilities = ['messaging/invalid-registration-token', 'messaging/registration-token-not-registered']

            if (error && tokenErrorPossibilities.indexOf(error.code) !== -1) {
              databaseReference(`/device_tokens/${recipientUID}/${tokenSnapshot[index]}`).remove();
            }
          })

          return Handlers.success('Notification sent', null, 204)
        } catch (error) {
          return Handlers.error('Could not send notification', error, 500)
        }
      }


      return sendNotificationToIndividual(uid)
    } catch (error) {
      return Handlers.error('Could not fetch device tokens', error, 500)
    }
  }
}
