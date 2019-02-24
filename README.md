# What's this about??
A few years back a project called Multi-Lingual Fam was launched with the goal of increasing awareness and promoting the 
use of African Languages amongst students at the University of Cape Town. This was achieved by putting up a new poster 
every day which contained a word with phrases demonstrating its use together with an English translation, as well as an 
interactive component. Click [here](https://www.instagram.com/tutorxsocialprojects/) if you would like to see the posters we made. 

During the course of the campaign we realised that people where more likely to remember the phrase if they were in a context
where they could use the word/phrase shortly after learning it. For example: at a bus stop a word in isiXhosa like "Uyaphi?", 
meaning "where are you going?", would have a high chance of being used and remembered. Based on this insight, I started thinking... what if
there was an app that could recommend words and phrases given a user's current location... The idea remained dormant until now! 

This project will always be open source and will be a good place to find sample code for building features into your own app. 
If you feel passionate about preserving African languages and culture or just want to help out please do get in touch. We have a 
totally open door policy. Anyone who helps will be acknowledge as a team member in the app. 

### Sister Repo
The accompanying Android app repo can be found [here](https://github.com/olddustysocksunderthecouch/LocationForegroundServiceSample)
 
# "Steal-able Code" 
- Project structure --> best practices were implemented to the best of our abilities
- Cloud Function (**CF**) which can be triggered from a device/client (`onCall()`)
- **sendNotification** to users (and an **addToken** CF which stores a user's unique device token when called)
- Storing data in the Realtime Database from a CF.

# Architecture
Since a typed languages generally don't mess your sanity as much as others we decided to go with **TypeScript**
- `interfaces` are equivalent to Plain Old Java Objects (POJOs) aka data models
- Declaring that something is a specific type is similar to Kotlin

Data for the locations at which, the Cloud Function (**CF**) will send a notification to the user is store in the CF 
itself for now as there are only a few points. 

_Open for suggestions on what else to include in this section or any other section for that matter_

# Setup
### General
 1. Create a new Firebase Project using the [Firebase Console](https://console.firebase.google.com).
 1. Enable **Email Provider** in the [Auth section](https://console.firebase.google.com/project/_/authentication/providers)
 
 ### Cloud Functions
 See the accompanying [Android Repo](https://github.com/olddustysocksunderthecouch/LocationForegroundServiceSample) 
 for other setup instructions
 1. Clone or download this repo and open the directory in a terminal/command line of your choice.
 1. If you don't have the Firebase CLI installed it with `npm install -g firebase-tools` (`-g` make installs it globally) 
 1. To login enter `firebase login` in your terminal.
 1. Configure the CLI to point to the project with the following command `firebase use --add` and select the project you 
 made in Firebase Console from the list.
 1. Install dependencies locally by running: `cd functions` then `npm install` (or just `cd functions; npm install`)
 1. Deploy your project using `firebase deploy` For faster deployment you can just deploy functions after your initial deploy with:
 `firebase deploy --only functions`
1. Call as soon as the Android App installed and opened, you should see it trigger the addToken function in the CF logs section.

# Want to help out?
### Principal/Values
- This project will always be open source
- We will never store a long term history of user's location data
- We will never sell user location data or any other data for that matter
- If you contribute to the project you will be acknowledged for your contribution

### Questions / Features You could help out with
- How to we keep location tracking accurate while having a limited impact on battery?
- Strategy/logic around when notifications are sent to users?
- How do we implement language preferences?
- Security and Storage Rules
- **Translations** and word/phrase suggestions
- Design - we need a better logo as well as some UX work
- Bring in **your own ideas** and implement them! 

### I'm in, what's next?
Fill in [this super quick Google Form](https://goo.gl/forms/TIE4wfNlaMAeNOwp2) and I'll get in touch with you ASAP.
