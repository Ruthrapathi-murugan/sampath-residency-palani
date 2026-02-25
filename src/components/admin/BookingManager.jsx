import React, { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { generateAllBookingsPDF, generateBookingPDF } from "../../utils/pdfGenerator";
import { db } from "../../firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { reduceInventoryAsync } from "../../utils/inventoryUtils";
import "../../css/admin.css";

export default function BookingManager() {
  const [bookings, setBookings] = useState([]);
  const [sendingId, setSendingId] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null);
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, upcoming, checkIn, revenue

  useEffect(() => {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach((docSnap) => {
        data.push({ id: docSnap.id, ...docSnap.data() });
      });
      setBookings(data);
    }, (error) => {
      console.error("Error fetching bookings:", error);
    });

    return () => unsubscribe();
  }, []);

  // Calculate booking statistics
  const getBookingStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let upcoming = 0;
    let past = 0;
    let today_count = 0;
    let totalRevenue = 0;
    let approvedRevenue = 0;

    bookings.forEach((b) => {
      const checkInDate = new Date(b.checkIn);
      checkInDate.setHours(0, 0, 0, 0);

      // Count bookings
      if (checkInDate > today) upcoming++;
      else if (checkInDate < today) past++;
      else today_count++;

      // Calculate revenue (only approved bookings)
      if (b.status === "approved") {
        approvedRevenue += b.totalPrice || 0;
      }
      totalRevenue += b.totalPrice || 0;
    });

    return { upcoming, past, today: today_count, totalRevenue, approvedRevenue };
  };

  // Sort bookings
  const getSortedBookings = () => {
    const booked = [...bookings];

    switch (sortBy) {
      case "oldest":
        return booked.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      case "upcoming":
        return booked.sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));

      case "checkIn":
        return booked.sort((a, b) => {
          const dateA = new Date(a.checkIn);
          const dateB = new Date(b.checkIn);
          return dateA - dateB;
        });

      case "revenue":
        return booked.sort((a, b) => (b.totalPrice || 0) - (a.totalPrice || 0));

      case "newest":
      default:
        return booked.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const removeBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await deleteDoc(doc(db, "bookings", id));
    } catch (err) {
      console.error("Failed to remove booking:", err);
      alert("Failed to delete booking.");
    }
  };

  const updateBookingStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "bookings", id), { status: newStatus });
    } catch (err) {
      console.error("Failed to update booking:", err);
      throw err;
    }
  };

  const approveBooking = async (booking) => {
    setActionInProgress(`approve-${booking.id}`);

    try {
      // Send approval email to customer
      const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
      const customerTemplateID = process.env.REACT_APP_EMAILJS_CUSTOMER_TEMPLATE_ID;
      const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

      if (serviceID && customerTemplateID && publicKey) {
        const templateParams = {
          from_name: booking.name || "",
          from_email: booking.email || "",
          email: booking.email || "",
          reply_to: booking.email || "",
          phone: booking.phone || "",
          address: booking.address || "",
          check_in: booking.checkIn || "",
          check_out: booking.checkOut || "",
          number_of_nights: booking.numberOfNights || 1,
          price_per_night: booking.roomPrice || "",
          total_price: booking.totalPrice || booking.roomPrice || "",
          special_requests: booking.specialRequests || "",
          room_category: booking.roomCategory || "",
          to_email: booking.email || "",
          booking_status: "APPROVED",
        };

        await emailjs.send(serviceID, customerTemplateID, templateParams, publicKey);
        alert("✅ Booking approved! Confirmation email sent to customer.");
      } else {
        alert("⚠️ EmailJS not configured. Please configure it to send approval emails.");
      }

      // Update booking status
      await updateBookingStatus(booking.id, "approved");

      // Reduce Inventory for the booked dates
      if (booking.roomId && booking.checkIn && booking.checkOut) {
        let start = new Date(booking.checkIn);
        const end = new Date(booking.checkOut);

        // Loop through each night and reduce inventory by 1
        while (start < end) {
          const dateStr = start.toISOString().split("T")[0];
          await reduceInventoryAsync(booking.roomId, dateStr, 1);
          start.setDate(start.getDate() + 1);
        }
      }

    } catch (err) {
      console.error("Failed to approve booking:", err);
      alert("Failed to send approval email or update database. Check console for details.");
    } finally {
      setActionInProgress(null);
    }
  };

  const rejectBooking = async (booking) => {
    const reason = window.prompt("Enter reason for rejection (optional):");
    if (reason === null) return; // User cancelled

    setActionInProgress(`reject-${booking.id}`);

    try {
      // Send rejection email to customer
      const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
      const customerTemplateID = process.env.REACT_APP_EMAILJS_CUSTOMER_TEMPLATE_ID;
      const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

      if (serviceID && customerTemplateID && publicKey) {
        const templateParams = {
          from_name: booking.name || "",
          from_email: booking.email || "",
          email: booking.email || "",
          reply_to: booking.email || "",
          phone: booking.phone || "",
          address: booking.address || "",
          check_in: booking.checkIn || "",
          check_out: booking.checkOut || "",
          number_of_nights: booking.numberOfNights || 1,
          price_per_night: booking.roomPrice || "",
          total_price: booking.totalPrice || booking.roomPrice || "",
          special_requests: booking.specialRequests || "",
          room_category: booking.roomCategory || "",
          to_email: booking.email || "",
          booking_status: "REJECTED",
          rejection_reason: reason || "Not available",
        };

        await emailjs.send(serviceID, customerTemplateID, templateParams, publicKey);
        alert("✅ Booking rejected! Rejection email sent to customer.");
      } else {
        alert("⚠️ EmailJS not configured. Please configure it to send rejection emails.");
      }

      // Update booking status
      await updateBookingStatus(booking.id, "rejected");
    } catch (err) {
      console.error("Failed to reject booking:", err);
      alert("Failed to send rejection email or update database. Check console for details.");
    } finally {
      setActionInProgress(null);
    }
  };

  if (!bookings || bookings.length === 0) {
    return (
      <div className="admin-panel-section p-4">
        <h3>📋 Bookings</h3>
        <p>No bookings found.</p>
      </div>
    );
  }

  const stats = getBookingStats();
  const sortedBookings = getSortedBookings();

  return (
    <div className="admin-panel-section p-4">
      {/* Header with Title and PDF Download */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3>📋 Bookings</h3>
        <button
          className="btn btn-success btn-sm"
          onClick={() => generateAllBookingsPDF(bookings)}
          style={{ display: "flex", alignItems: "center", gap: "5px" }}
        >
          <i className="fas fa-download"></i>
          Download All as PDF
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "12px", opacity: 0.9, marginBottom: "5px" }}>Total Bookings</div>
            <div style={{ fontSize: "32px", fontWeight: "700" }}>{bookings.length}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div style={{
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "12px", opacity: 0.9, marginBottom: "5px" }}>Upcoming</div>
            <div style={{ fontSize: "32px", fontWeight: "700" }}>{stats.upcoming}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div style={{
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "12px", opacity: 0.9, marginBottom: "5px" }}>Past Bookings</div>
            <div style={{ fontSize: "32px", fontWeight: "700" }}>{stats.past}</div>
          </div>
        </div>
        <div className="col-md-3">
          <div style={{
            background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "12px", opacity: 0.9, marginBottom: "5px" }}>Today</div>
            <div style={{ fontSize: "32px", fontWeight: "700" }}>{stats.today}</div>
          </div>
        </div>
      </div>

      {/* Revenue Section */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div style={{
            background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
            color: "white",
            padding: "20px",
            borderRadius: "8px"
          }}>
            <div style={{ fontSize: "13px", opacity: 0.95, marginBottom: "5px" }}>Total Revenue</div>
            <div style={{ fontSize: "28px", fontWeight: "700" }}>Rs. {stats.totalRevenue.toLocaleString()}</div>
            <div style={{ fontSize: "11px", opacity: 0.85, marginTop: "5px" }}>All bookings (including pending & rejected)</div>
          </div>
        </div>
        <div className="col-md-6">
          <div style={{
            background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
            color: "white",
            padding: "20px",
            borderRadius: "8px"
          }}>
            <div style={{ fontSize: "13px", opacity: 0.95, marginBottom: "5px" }}>Approved Revenue</div>
            <div style={{ fontSize: "28px", fontWeight: "700" }}>Rs. {stats.approvedRevenue.toLocaleString()}</div>
            <div style={{ fontSize: "11px", opacity: 0.85, marginTop: "5px" }}>Only approved bookings</div>
          </div>
        </div>
      </div>

      {/* Sorting Controls */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
        <label style={{ fontWeight: "600", marginBottom: 0 }}>Sort by:</label>
        <select
          className="form-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ maxWidth: "250px" }}
        >
          <option value="newest">📅 Newest First</option>
          <option value="oldest">📅 Oldest First</option>
          <option value="checkIn">📍 Check-in Date (Early)</option>
          <option value="revenue">💰 Revenue (High to Low)</option>
          <option value="upcoming">⏭️ Upcoming First</option>
        </select>
      </div>

      {/* Bookings Table */}
      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>When</th>
              <th>Room</th>
              <th>Name</th>
              <th>Email</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedBookings.map((b) => (
              <tr key={b.id} style={{ backgroundColor: b.status === "pending" ? "#fff3cd" : b.status === "approved" ? "#d4edda" : "#f8d7da" }}>
                <td>{b.createdAt?.toDate ? b.createdAt.toDate().toLocaleString() : new Date(b.createdAt).toLocaleString()}</td>
                <td>{b.roomCategory || b.roomName}</td>
                <td>{b.name || b.customerName}</td>
                <td>{b.email || b.customerEmail}</td>
                <td>{b.checkIn}</td>
                <td>{b.checkOut}</td>
                <td>
                  <strong>{b.totalPrice ? `Rs. ${b.totalPrice}` : (b.roomPrice || "Rs. 0")}</strong>
                  <br />
                  <small style={{ color: "#666" }}>({b.numberOfNights || 1} nights)</small>
                </td>
                <td>
                  {b.status === "pending" && <span className="badge bg-warning">⏳ Pending</span>}
                  {b.status === "approved" && <span className="badge bg-success">✅ Approved</span>}
                  {b.status === "rejected" && <span className="badge bg-danger">❌ Rejected</span>}
                </td>
                <td>
                  {b.status === "pending" && (
                    <>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => approveBooking(b)}
                        disabled={actionInProgress === `approve-${b.id}`}
                      >
                        {actionInProgress === `approve-${b.id}` ? "Approving..." : "✅ Approve"}
                      </button>
                      <button
                        className="btn btn-sm btn-danger me-2"
                        onClick={() => rejectBooking(b)}
                        disabled={actionInProgress === `reject-${b.id}`}
                      >
                        {actionInProgress === `reject-${b.id}` ? "Rejecting..." : "❌ Reject"}
                      </button>
                    </>
                  )}
                  {b.status !== "pending" && (
                    <button className="btn btn-sm btn-secondary me-2" disabled>
                      —
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => generateBookingPDF(b)}
                    title="Download PDF"
                  >
                    📥 PDF
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => removeBooking(b.id)}>
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
