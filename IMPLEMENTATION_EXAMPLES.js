/**
 * SAMPLE IMPLEMENTATION GUIDE
 * 
 * This file shows how to integrate the inventory system with your booking page
 * Copy and paste relevant code into your actual BookingPage.js or booking component
 */

import React, { useState } from "react";
import {
  getAvailableInventory,
  getRateForDate,
  isRoomBlocked,
  areAllRoomsBlocked,
  getAvailableRooms,
  canBookRoom,
  getRoomWithAvailability,
} from "../utils/inventoryUtils";

/**
 * EXAMPLE 1: Simple Booking Check
 * Use this to check if a specific room can be booked on a date
 */
export function ExampleSimpleBookingCheck() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const roomId = 1; // Double bed A/C

  const bookingStatus = canBookRoom(roomId, selectedDate);
  const rate = getRateForDate(roomId, selectedDate);

  return (
    <div className="booking-check">
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {bookingStatus.canBook ? (
        <div className="booking-available">
          <p>✓ Room available for booking</p>
          <p>Rate: ₹{rate} per night</p>
          <button className="btn btn-primary">Book Now</button>
        </div>
      ) : (
        <div className="booking-unavailable">
          <p>✗ {bookingStatus.reason}</p>
          <button className="btn btn-secondary" disabled>
            Cannot Book
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * EXAMPLE 2: Show Available Rooms for a Date
 * Display only the rooms that can be booked on selected date
 */
export function ExampleAvailableRoomsList() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const roomTypes = [
    { id: 1, name: "Double bed A/C", defaultPrice: 1800 },
    { id: 2, name: "Triple Bed A/C", defaultPrice: 2000 },
    { id: 3, name: "Four Bed A/C", defaultPrice: 2200 },
    { id: 4, name: "Five Bed A/C", defaultPrice: 2400 },
  ];

  const availableRoomIds = getAvailableRooms(selectedDate);
  const isPropertyClosed = availableRoomIds.length === 0;

  return (
    <div className="available-rooms">
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {isPropertyClosed ? (
        <div className="alert alert-danger">
          Property is fully booked or closed on {selectedDate}
        </div>
      ) : (
        <div className="rooms-grid">
          {roomTypes.map((room) => {
            const isAvailable = availableRoomIds.includes(room.id);
            const rate = getRateForDate(room.id, selectedDate);
            const inventory = getAvailableInventory(room.id, selectedDate);

            return (
              <div key={room.id} className="room-card">
                <h3>{room.name}</h3>
                {isAvailable ? (
                  <>
                    <p>Available: {inventory} room(s)</p>
                    <p className="price">₹{rate}/night</p>
                    <button className="btn btn-success">Book</button>
                  </>
                ) : (
                  <>
                    <p className="unavailable">Not Available</p>
                    <button className="btn btn-secondary" disabled>
                      Unavailable
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * EXAMPLE 3: Complete Room Details with Availability
 * Show comprehensive room information including admin settings
 */
export function ExampleRoomDetailsWithAvailability({ roomId }) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const roomDetails = getRoomWithAvailability(roomId, selectedDate);

  return (
    <div className="room-details-availability">
      <h2>{roomDetails.name}</h2>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {roomDetails.isBlocked ? (
        <div className="alert alert-warning">
          This room is blocked for {selectedDate}
        </div>
      ) : (
        <>
          <p>
            <strong>Rate:</strong> ₹{roomDetails.rate}/night
          </p>
          <p>
            <strong>Available:</strong> {roomDetails.availableRooms} room(s)
          </p>

          {roomDetails.canBook ? (
            <button className="btn btn-primary btn-lg">Book Now</button>
          ) : (
            <>
              <p className="text-danger">{roomDetails.bookingReason}</p>
              <button className="btn btn-secondary" disabled>
                Not Available
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

/**
 * EXAMPLE 4: Display Available Rooms Count
 * Show how many rooms of each type are available
 */
export function ExampleInventoryDisplay() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const roomTypes = [
    { id: 1, name: "Double bed A/C" },
    { id: 2, name: "Triple Bed A/C" },
    { id: 3, name: "Four Bed A/C" },
    { id: 4, name: "Five Bed A/C" },
  ];

  return (
    <div className="inventory-display">
      <h3>Room Availability for {selectedDate}</h3>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      <table className="table">
        <thead>
          <tr>
            <th>Room Type</th>
            <th>Available</th>
            <th>Rate</th>
            <th>Blocked</th>
          </tr>
        </thead>
        <tbody>
          {roomTypes.map((room) => (
            <tr key={room.id}>
              <td>{room.name}</td>
              <td>{getAvailableInventory(room.id, selectedDate)}</td>
              <td>₹{getRateForDate(room.id, selectedDate)}</td>
              <td>
                {isRoomBlocked(room.id, selectedDate) ? (
                  <span className="badge bg-danger">Blocked</span>
                ) : (
                  <span className="badge bg-success">Available</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * EXAMPLE 5: Complete Booking Form Integration
 * Full example of how to integrate with a booking form
 */
export function ExampleCompleteBookingForm() {
  const [bookingData, setBookingData] = useState({
    date: new Date().toISOString().split("T")[0],
    roomId: 1,
    nights: 1,
    guests: 1,
  });

  const handleDateChange = (e) => {
    setBookingData({ ...bookingData, date: e.target.value });
  };

  const handleRoomChange = (e) => {
    setBookingData({ ...bookingData, roomId: parseInt(e.target.value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if room can be booked
    const bookingStatus = canBookRoom(bookingData.roomId, bookingData.date);

    if (!bookingStatus.canBook) {
      alert(bookingStatus.reason);
      return;
    }

    // Calculate total price
    const rate = getRateForDate(bookingData.roomId, bookingData.date);
    const totalPrice = rate * bookingData.nights;

    alert(
      `Booking confirmed!\nRoom: ${bookingData.roomId}\nDate: ${bookingData.date}\nNights: ${bookingData.nights}\nTotal: ₹${totalPrice}`
    );

    // Here you would send data to your backend
  };

  const availableRoomIds = getAvailableRooms(bookingData.date);
  const roomRate = getRateForDate(bookingData.roomId, bookingData.date);
  const totalPrice = roomRate * bookingData.nights;

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <h2>Book a Room</h2>

      <div className="form-group">
        <label>Check-in Date:</label>
        <input
          type="date"
          required
          value={bookingData.date}
          onChange={handleDateChange}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      <div className="form-group">
        <label>Room Type:</label>
        <select
          value={bookingData.roomId}
          onChange={handleRoomChange}
          required
        >
          {availableRoomIds.length === 0 ? (
            <option value="">No rooms available</option>
          ) : (
            availableRoomIds.map((roomId) => (
              <option key={roomId} value={roomId}>
                Room {roomId}
              </option>
            ))
          }
        </select>
      </div>

      <div className="form-group">
        <label>Number of Nights:</label>
        <input
          type="number"
          min="1"
          max="30"
          value={bookingData.nights}
          onChange={(e) =>
            setBookingData({ ...bookingData, nights: parseInt(e.target.value) })
          }
          required
        />
      </div>

      <div className="form-group">
        <label>Guests:</label>
        <input
          type="number"
          min="1"
          max="10"
          value={bookingData.guests}
          onChange={(e) =>
            setBookingData({ ...bookingData, guests: parseInt(e.target.value) })
          }
          required
        />
      </div>

      <div className="price-summary">
        <p>Rate per night: ₹{roomRate}</p>
        <p>Number of nights: {bookingData.nights}</p>
        <h3>Total Price: ₹{totalPrice}</h3>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={availableRoomIds.length === 0}
      >
        {availableRoomIds.length === 0 ? "No Rooms Available" : "Book Now"}
      </button>
    </form>
  );
}

/**
 * TESTING GUIDE
 *
 * To test the integration:
 *
 * 1. Open Admin Panel: http://localhost:3000/admin
 * 2. Login with password: Sampath@2024
 * 3. Go to "Inventory Management"
 * 4. Select today's date
 * 5. Set "Double bed A/C" to 0 (no inventory)
 * 6. Click Save
 * 7. Now try to book using your booking page - it should show unavailable
 *
 * 8. Try the same with "Room Blocking" - set room to blocked
 * 9. Try booking - should show "blocked" message
 *
 * 10. In "Rate Management", change a room's price
 * 11. Check booking page - it should show the new price
 *
 * 12. Block all 4 rooms - check that property shows as closed
 */
