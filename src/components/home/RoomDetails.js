import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { roomItems } from "../data/Data";
import emailjs from "@emailjs/browser"; // For API calls to send emails

export default function RoomDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const room = roomItems.find((item) => item.id === parseInt(id));
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    if (searchParams.get("book") === "true") {
      setShowBookingForm(true);
    }
  }, [searchParams]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    checkIn: "",
    checkOut: "",
    specialRequests: "",
    roomCategory: room?.name || "",
    roomPrice: room?.price || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // EmailJS constants - User needs to replace these with their own from emailjs.com
   const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
   const hotelTemplateID = process.env.REACT_APP_EMAILJS_HOTEL_TEMPLATE_ID;
   const customerTemplateID = process.env.REACT_APP_EMAILJS_CUSTOMER_TEMPLATE_ID;
   const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

   console.log("Debug EmailJS Keys:", {
       serviceID: !!serviceID,
       hotelTemplateID: !!hotelTemplateID,
       customerTemplateID: !!customerTemplateID,
       publicKey: !!publicKey,
   });

   if (!serviceID || !hotelTemplateID || !publicKey) {
       alert("EmailJS configuration is missing. Please check the logs.");
       setIsSubmitting(false);
       return;
   }


    const templateParams = {
      from_name: formData.name,
      from_email: formData.email, // Often used in 'Reply To'
      email: formData.email,      // Common default variable for customer email
      reply_to: formData.email,   // Explicit 'Reply To' variable
      phone: formData.phone,
      address: formData.address,
      check_in: formData.checkIn,
      check_out: formData.checkOut,
      special_requests: formData.specialRequests,
      room_category: formData.roomCategory,
      room_price: formData.roomPrice,
      to_email: formData.email, // For customer confirmation
    };

    // Debug the payload
    console.log("Sending Emails with Params:", templateParams);

    // 1. Send Booking Details to Hotel
    emailjs
      .send(serviceID, hotelTemplateID, templateParams, publicKey)
      .then((response) => {
        console.log("✅ Hotel Email Sent!", response.status, response.text);

        // 2. Send Confirmation to Customer
        return emailjs.send(
          serviceID,
          customerTemplateID,
          templateParams,
          publicKey
        );
      })
      .then((response) => {
        console.log("✅ Customer Email Sent!", response.status, response.text);
        setSubmitSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          checkIn: "",
          checkOut: "",
          specialRequests: "",
          roomCategory: room?.name || "",
          roomPrice: room?.price || "",
        });
      })
      .catch((err) => {
        console.error("❌ Email Sending Failed:", err);
        let errorMessage = "Failed to send booking request.";
        if (err.status === 400) {
          errorMessage += " (Bad Request: Check Service ID, Template ID, or Public Key in .env)";
        }
        if (err.text) errorMessage += "\nError Details: " + err.text;
        alert(errorMessage);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (!room) {
    return (
      <div className="container text-center py-5">
        <h1>Room Not Found</h1>
        <p>The room you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">{room.name}</h2>

      {/* Main Media Display */}
      <div
        className="mb-4"
        style={{ maxHeight: "500px", width: "200px", overflow: "hidden" }}
      >
        {room.mediaType === "video" ? (
          <video
            controls
            autoPlay
            muted
            loop
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
          >
            <source src={room.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={room.img}
            alt={room.name}
            style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            className="rounded"
          />
        )}
      </div>

      {/* Additional Media Gallery */}
      <div className="row mb-4">
        {room.additionalImages?.map((image, index) => (
          <div key={`img-${index}`} className="col-md-4 mb-3">
            <img
              src={image}
              alt={`Additional view ${index + 1}`}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
              className="rounded"
            />
          </div>
        ))}
        {room.additionalVideos?.map((video, index) => (
          <div key={`vid-${index}`} className="col-md-4 mb-3">
            <video
              controls
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            >
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <div className="d-flex align-items-center mb-2">
          {room.star}
          <span className="ms-2">(5 Reviews)</span>
        </div>
        <p className="mb-3">{room.description}</p>

        <h5 className="mt-4 mb-3">Amenities</h5>
        <ul className="list-unstyled row">
          {room.amenities.map((amenity, index) => (
            <li key={index} className="col-md-3 d-flex align-items-center mb-2">
              <i className="fa fa-check-circle text-primary me-2"></i>
              <span className="text-secondary">{amenity}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="d-flex justify-content-between align-items-center border-top pt-4">
        <h4 className="mb-0">{room.price}</h4>
        <div>
          <button className="btn btn-warning me-2">{room.yellowbtn}</button>
          <button
            className="btn btn-dark"
            onClick={() => setShowBookingForm(true)}
          >
            {room.darkbtn}
          </button>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="modal-content bg-white p-4 rounded"
            style={{ width: "90%", maxWidth: "600px" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>Book {room.name}</h3>
              <button
                className="btn-close"
                onClick={() => {
                  setShowBookingForm(false);
                  setSubmitSuccess(false);
                }}
              ></button>
            </div>

            {submitSuccess ? (
              <div className="alert alert-success">
                <h4>Booking Successful!</h4>
                <p>We've sent a confirmation to your email. Thank you!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Check-in Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split("T")[0]} // 👉 sets min date to today
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Check-out Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleInputChange}
                      required
                      min={
                        formData.checkIn ||
                        new Date().toISOString().split("T")[0]
                      } // 👉 check-out can't be before check-in
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Room Category</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.roomCategory}
                      readOnly
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Price</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.roomPrice}
                      readOnly
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Special Requests</label>
                    <textarea
                      className="form-control"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => setShowBookingForm(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Confirm Booking"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
