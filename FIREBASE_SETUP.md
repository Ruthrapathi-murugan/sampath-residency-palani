Firebase integration steps (Firestore + Cloud Functions)

1) Create Firebase project
   - Go to https://console.firebase.google.com and create a new project.
   - Enable Firestore (Native mode).

2) Add web app and copy config keys.
   - In project settings -> SDK setup, register a web app and copy the config.
   - Set the following env vars in your `.env` file (project root):

REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...

3) Install Firebase client SDK

npm install firebase

4) Client usage
   - The project includes `src/firebase.js` which reads the env vars and exports `db`.
   - `RoomDetails.js` now writes bookings to `bookings` collection in Firestore.

5) Security rules (example)
   - In Firestore rules, allow unauthenticated create of bookings but protect read:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /bookings/{docId} {
      allow create: if request.resource.data.keys().hasAll(["roomId","customerName","customerEmail","checkIn","roomPrice"]);
      allow read: if request.auth != null && request.auth.token.admin == true; // requires admin auth setup
      allow update, delete: if false;
    }
  }
}

6) Cloud Function to send emails (recommended)
   - Create a Cloud Function (Node.js) that triggers on Firestore `bookings` onCreate.
   - Use SendGrid (or any SMTP service) to send hotel + customer emails.

Example function (see `cloud-functions/sendBookingEmail.js`).

7) Deploy functions and set SendGrid API key in function environment.

8) Migration
   - If you have existing local bookings in `localStorage.bookings`, export them and insert into Firestore (script provided on request).

Notes
- Keep SendGrid API keys out of client env vars; store them in Cloud Function environment.
- Test in a staging Firebase project before switching production.
