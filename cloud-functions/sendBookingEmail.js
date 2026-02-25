// Example Cloud Function (Node.js) using SendGrid
// Deploy this to Firebase Cloud Functions or another serverless platform.

/*
  Steps:
  1. Set up Firebase functions: `firebase init functions`
  2. Install dependencies: `npm install @sendgrid/mail`
  3. Add environment variable for SENDGRID_API_KEY
  4. Deploy the function
*/

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendBookingEmail = functions.firestore
  .document("bookings/{bookingId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const bookingId = context.params.bookingId;

    try {
      // Send email to hotel
      const hotelMsg = {
        to: process.env.HOTEL_NOTIFICATION_EMAIL, // set in functions config
        from: process.env.SEND_FROM_EMAIL,
        subject: `New booking: ${data.roomName} - ${data.customerName}`,
        text: `New booking details:\nName: ${data.customerName}\nEmail: ${data.customerEmail}\nCheck-in: ${data.checkIn}\nCheck-out: ${data.checkOut}\nRoom: ${data.roomName}\nPrice: ${data.roomPrice}`,
      };

      await sgMail.send(hotelMsg);

      // Send customer confirmation
      const customerMsg = {
        to: data.customerEmail,
        from: process.env.SEND_FROM_EMAIL,
        subject: `Booking confirmation - ${data.roomName}`,
        text: `Dear ${data.customerName},\n\nThank you for booking ${data.roomName}. Your check-in: ${data.checkIn}.\n\nRegards,`,
      };

      await sgMail.send(customerMsg);

      // update document with emailSent flag
      await admin.firestore().collection("bookings").doc(bookingId).update({
        emailSent: true,
        emailedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to send booking emails:", err);
      await admin.firestore().collection("bookings").doc(bookingId).update({
        emailSent: false,
        emailError: err.message || String(err),
      });
    }
  });
