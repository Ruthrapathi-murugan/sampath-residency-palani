import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom";
import {
  getAvailableRoomsAsync,
  getRoomWithAvailabilityAsync,
  getAvailableInventoryAsync,
  getRateForDateAsync,
} from "../../utils/inventoryUtils";

export default function Book() {
  // State for check-in and check-out dates
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [roomsCount, setRoomsCount] = useState(1);
  const [baseAvailableRoomsInfo, setBaseAvailableRoomsInfo] = useState([]); // All available rooms for the date
  const [availableRoomsInfo, setAvailableRoomsInfo] = useState([]); // Filtered rooms
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [roomSelections, setRoomSelections] = useState([""]); // one selection per room
  const [numberOfNights, setNumberOfNights] = useState(0);

  // Hotel contact info
  const HOTEL_EMAIL = "sampathresidencyatpalani@gmail.com";
  const HOTEL_PHONE = "9626380310";

  const roomCapacities = {
    1: { maxAdults: 3, maxChildren: 1, totalMax: 3 }, // Double/Two bed
    2: { maxAdults: 3, maxChildren: 2, totalMax: 4 }, // Triple bed
    3: { maxAdults: 4, maxChildren: 1, totalMax: 5 }, // Four bed
    4: { maxAdults: 5, maxChildren: 1, totalMax: 6 }, // Five bed
  };

  useEffect(() => {
    // Adjust roomSelections length when roomsCount changes
    setRoomSelections((prev) => {
      const copy = [...prev];
      while (copy.length < roomsCount) copy.push("");
      while (copy.length > roomsCount) copy.pop();
      return copy;
    });
  }, [roomsCount]);

  // Apply filtering whenever base rooms, adults, children, or roomsCount changes
  useEffect(() => {
    if (baseAvailableRoomsInfo.length === 0) {
      setAvailableRoomsInfo([]);
      return;
    }

    let filteredInfo = baseAvailableRoomsInfo;

    // Only apply strict capacity filtering if exactly 1 room is selected
    if (roomsCount === 1) {
      filteredInfo = baseAvailableRoomsInfo.filter(room => {
        const cap = roomCapacities[room.id];
        if (!cap) return true; // If no capacity defined, allow it

        return adults <= cap.maxAdults &&
          children <= cap.maxChildren &&
          (adults + children) <= cap.totalMax;
      });
    }

    setAvailableRoomsInfo(filteredInfo);

    const iso = formatDateToISO(checkIn);
    if (filteredInfo.length === 0) {
      setAvailabilityMessage("Your party exceeds the maximum capacity of a single room. Please select 2 or more rooms.");
    } else {
      setAvailabilityMessage(`${filteredInfo.length} room category(ies) available for ${iso}`);
    }
  }, [baseAvailableRoomsInfo, adults, children, roomsCount]);

  const navigate = useNavigate();

  const formatDateToISO = (d) => {
    if (!d) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Calculate number of nights between check-in and check-out
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff > 0 ? daysDiff : 0;
  };

  // Update nights when dates change
  useEffect(() => {
    const nights = calculateNights();
    setNumberOfNights(nights);
  }, [checkIn, checkOut]);

  const handleCheckInChange = async (date) => {
    setCheckIn(date);
    setAvailabilityMessage("");
    setBaseAvailableRoomsInfo([]);
    if (!date) return;

    setIsCheckingAvailability(true);
    const iso = formatDateToISO(date);
    try {
      const availableIds = await getAvailableRoomsAsync(iso);
      if (!availableIds || availableIds.length === 0) {
        setAvailabilityMessage("No rooms available for selected date.");
        setIsCheckingAvailability(false);
        return;
      }

      const allInfoPromises = availableIds.map((id) => getRoomWithAvailabilityAsync(id, iso));
      const allInfo = await Promise.all(allInfoPromises);

      setBaseAvailableRoomsInfo(allInfo);
    } catch (err) {
      console.error("Failed to compute availability:", err);
      setAvailabilityMessage("Error checking availability. Please try again.");
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  return (
    <div className="container-fluid booking pb-5 wow fadeIn" data-wow-delay="0.1s">
      <div className="container">
        <div className="bg-white shadow" style={{ padding: "35px" }}>
          <div className="row g-2">
            <div className="col-md-10">
              <div className="row g-2">
                {/* Check-in Date Picker */}
                <div className="col-md-3">
                  <DatePicker
                    selected={checkIn}
                    onChange={(date) => handleCheckInChange(date)}
                    className="form-control"
                    placeholderText="Check-in"
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()} // Prevent past dates
                  />
                </div>

                {/* Check-out Date Picker */}
                <div className="col-md-3">
                  <DatePicker
                    selected={checkOut}
                    onChange={(date) => setCheckOut(date)}
                    className="form-control"
                    placeholderText="Check-out"
                    dateFormat="dd/MM/yyyy"
                    minDate={checkIn || new Date()} // Ensure check-out is after check-in
                  />
                </div>

                {/* Adults Dropdown */}
                <div className="col-md-2">
                  <select
                    className="form-select"
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value || 1))}
                  >
                    <option value={1}>1 Adult</option>
                    <option value={2}>2 Adults</option>
                    <option value={3}>3 Adults</option>
                    <option value={4}>4 Adults</option>
                    <option value={5}>5 Adults</option>
                  </select>
                </div>

                {/* Children Dropdown */}
                <div className="col-md-2">
                  <select
                    className="form-select"
                    value={children}
                    onChange={(e) => setChildren(parseInt(e.target.value || 0))}
                  >
                    <option value={0}>0 Children</option>
                    <option value={1}>1 Child</option>
                    <option value={2}>2 Children</option>
                    <option value={3}>3 Children</option>
                    <option value={4}>4 Children</option>
                  </select>
                </div>

                {/* Rooms Count */}
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(parseInt(e.target.value || 1))}
                  >
                    <option value={1}>1 Room</option>
                    <option value={2}>2 Rooms</option>
                    <option value={3}>3 Rooms</option>
                  </select>
                </div>

                {/* Empty spacer (keeps layout) */}
                <div className="col-md-1" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="col-md-2">
              <button
                className="btn btn-primary w-100"
                onClick={() => {
                  // Validate selections
                  if (!checkIn) {
                    alert("Please select check-in date");
                    return;
                  }
                  const missing = roomSelections.some((s) => !s);
                  if (missing) {
                    alert("Please select category for each room");
                    return;
                  }

                  // If single room selection, navigate to room details booking
                  const firstSelection = roomSelections[0];
                  if (roomsCount === 1) {
                    // build query params
                    const params = new URLSearchParams();
                    params.set("book", "true");
                    params.set("checkIn", formatDateToISO(checkIn));
                    if (checkOut) params.set("checkOut", formatDateToISO(checkOut));
                    params.set("adults", String(adults));
                    params.set("children", String(children));
                    params.set("roomCategory", String(firstSelection));
                    navigate(`/room/${firstSelection}?${params.toString()}`);
                    return;
                  }

                  // Multi-room: not fully supported yet — guide user to book first room now
                  if (roomsCount > 1) {
                    if (window.confirm("Multi-room booking is currently handled one-by-one. Go to first selected room to book now?")) {
                      const params = new URLSearchParams();
                      params.set("book", "true");
                      params.set("checkIn", formatDateToISO(checkIn));
                      if (checkOut) params.set("checkOut", formatDateToISO(checkOut));
                      params.set("adults", String(adults));
                      params.set("children", String(children));
                      params.set("roomCategory", String(firstSelection));
                      navigate(`/room/${firstSelection}?${params.toString()}`);
                    }
                  }
                }}
              >
                Proceed to Booking
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Availability Panel - MakeMyTrip/Booking.com Style */}
      {isCheckingAvailability && (
        <div className="mt-5 text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="mt-3">Checking Live Availability...</h5>
        </div>
      )}

      {!isCheckingAvailability && availableRoomsInfo && availableRoomsInfo.length > 0 && (
        <div className="mt-5">
          {availabilityMessage && (
            <div className="alert alert-success mb-4">
              <i className="fa fa-check-circle me-2"></i>
              {availabilityMessage}
            </div>
          )}

          {/* Room Results */}
          <div className="row">
            <div className="col-12">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <h4 style={{ color: "#1a3a52", fontWeight: "600", margin: 0 }}>
                  Select Your Room
                </h4>
                <div style={{
                  backgroundColor: "#f8f9fa",
                  padding: "12px 16px",
                  borderRadius: "6px",
                  textAlign: "right",
                  border: "1px solid #dee2e6"
                }}>
                  <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
                    <strong>For Bookings & Inquiries:</strong>
                  </div>
                  <div style={{ fontSize: "13px", marginBottom: "3px" }}>
                    <i className="fas fa-envelope me-2" style={{ color: "#dc3545" }}></i>
                    <a href={`mailto:${HOTEL_EMAIL}`} style={{ color: "#007bff", textDecoration: "none" }}>
                      {HOTEL_EMAIL}
                    </a>
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    <i className="fas fa-phone me-2" style={{ color: "#28a745" }}></i>
                    <a href={`tel:${HOTEL_PHONE}`} style={{ color: "#007bff", textDecoration: "none" }}>
                      {HOTEL_PHONE}
                    </a>
                  </div>
                </div>
              </div>

              {/* Stay Summary */}
              {checkIn && (
                <div style={{
                  backgroundColor: "#e3f2fd",
                  border: "1px solid #90caf9",
                  borderRadius: "6px",
                  padding: "15px",
                  marginBottom: "20px",
                  display: "flex",
                  gap: "30px",
                  flexWrap: "wrap"
                }}>
                  <div>
                    <span style={{ fontSize: "12px", color: "#666" }}>Check-in</span>
                    <div style={{ fontSize: "16px", fontWeight: "600", color: "#1a3a52" }}>
                      {checkIn.toLocaleDateString()}
                    </div>
                  </div>
                  {checkOut && (
                    <>
                      <div>
                        <span style={{ fontSize: "12px", color: "#666" }}>Check-out</span>
                        <div style={{ fontSize: "16px", fontWeight: "600", color: "#1a3a52" }}>
                          {checkOut.toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ borderLeft: "1px solid #90caf9", paddingLeft: "20px" }}>
                        <span style={{ fontSize: "12px", color: "#666" }}>Duration</span>
                        <div style={{ fontSize: "16px", fontWeight: "600", color: "#28a745" }}>
                          {numberOfNights} {numberOfNights === 1 ? "night" : "nights"}
                        </div>
                      </div>
                    </>
                  )}
                  <div>
                    <span style={{ fontSize: "12px", color: "#666" }}>Guests</span>
                    <div style={{ fontSize: "16px", fontWeight: "600", color: "#1a3a52" }}>
                      {adults + children} {adults + children === 1 ? "guest" : "guests"}
                    </div>
                  </div>
                </div>
              )}

              {/* Room Cards Grid */}
              <div className="row g-4">
                {availableRoomsInfo.map((room) => (
                  <div key={room.id} className="col-lg-6">
                    <div
                      className="room-card-booking"
                      style={{
                        border: roomSelections[0] === String(room.id) ? "2px solid #007bff" : "1px solid #e0e0e0",
                        borderRadius: "8px",
                        overflow: "hidden",
                        backgroundColor: "#fff",
                        boxShadow: roomSelections[0] === String(room.id) ? "0 4px 12px rgba(0,123,255,0.2)" : "0 2px 8px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                    >
                      <div className="row g-0 h-100">
                        {/* Room Image */}
                        <div
                          className="col-md-5"
                          style={{
                            backgroundColor: "#f0f0f0",
                            minHeight: "250px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            color: "#999",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          {room.image ? (
                            <img
                              src={room.image}
                              alt={room.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div style={{ textAlign: "center" }}>
                              <i className="fas fa-image" style={{ fontSize: "48px", marginBottom: "10px", display: "block" }}></i>
                              Room Image
                            </div>
                          )}
                          {room.isBlocked && (
                            <div
                              style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                backgroundColor: "#dc3545",
                                color: "white",
                                padding: "5px 10px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                fontWeight: "600",
                              }}
                            >
                              BLOCKED
                            </div>
                          )}
                        </div>

                        {/* Room Details */}
                        <div className="col-md-7 p-4 d-flex flex-column justify-content-between">
                          <div>
                            <h5 style={{ color: "#1a3a52", marginBottom: "10px", fontWeight: "600" }}>
                              {room.name}
                            </h5>

                            {/* Room Info Icons */}
                            <div style={{ display: "flex", gap: "15px", marginBottom: "15px", flexWrap: "wrap" }}>
                              <span style={{ fontSize: "14px", color: "#666", marginRight: "10px" }}>
                                <i className="fas fa-users me-2" style={{ color: "#007bff" }}></i>
                                Max {roomCapacities[room.id]?.totalMax || 2} Guests
                              </span>
                              <span style={{ fontSize: "14px", color: "#666", marginRight: "10px", display: "inline-block" }}>
                                <i className="fas fa-user-tie me-1" style={{ color: "#17a2b8" }}></i>
                                {roomCapacities[room.id]?.maxAdults || 2} Adults
                              </span>
                              <span style={{ fontSize: "14px", color: "#666" }}>
                                <i className="fas fa-child me-1" style={{ color: "#ffc107" }}></i>
                                {roomCapacities[room.id]?.maxChildren || 0} Child
                              </span>
                              <span style={{ fontSize: "14px", color: "#666" }}>
                                <i className="fas fa-door-open me-2" style={{ color: "#28a745" }}></i>
                                {room.availableRooms} Avail.
                              </span>
                            </div>

                            {/* Room Features */}
                            <div style={{ marginBottom: "15px" }}>
                              <div style={{ fontSize: "13px", color: "#666", marginBottom: "5px" }}>
                                <i className="fas fa-wifi me-2" style={{ color: "#17a2b8" }}></i>
                                Free WiFi
                              </div>
                              <div style={{ fontSize: "13px", color: "#666" }}>
                                <i className="fas fa-snowflake me-2" style={{ color: "#17a2b8" }}></i>
                                Air Conditioning
                              </div>
                            </div>
                          </div>

                          {/* Price and Button */}
                          <div>
                            <div style={{ marginBottom: "12px" }}>
                              <div>
                                <span style={{ fontSize: "24px", fontWeight: "700", color: "#dc3545" }}>
                                  Rs. {room.rate * (numberOfNights || 1)}
                                </span>
                                <span style={{ fontSize: "14px", color: "#999", marginLeft: "5px" }}>
                                  {numberOfNights > 1 ? `for ${numberOfNights} nights` : "/night"}
                                </span>
                              </div>
                              {numberOfNights > 1 && (
                                <div style={{ fontSize: "12px", color: "#999", marginTop: "5px" }}>
                                  Rs. {room.rate} per night
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              className="btn w-100"
                              style={{
                                backgroundColor: roomSelections[0] === String(room.id) ? "#007bff" : "#f0f0f0",
                                color: roomSelections[0] === String(room.id) ? "white" : "#333",
                                border: "none",
                                borderRadius: "4px",
                                fontWeight: "600",
                                padding: "10px",
                                transition: "all 0.3s ease",
                              }}
                              onClick={() => {
                                const copy = [...roomSelections];
                                copy[0] = String(room.id);
                                setRoomSelections(copy);
                              }}
                              disabled={room.isBlocked || room.availableRooms === 0}
                            >
                              {roomSelections[0] === String(room.id) ? (
                                <>
                                  <i className="fas fa-check me-2"></i>
                                  SELECTED
                                </>
                              ) : room.isBlocked || room.availableRooms === 0 ? (
                                "NOT AVAILABLE"
                              ) : (
                                "SELECT ROOM"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Multi-room selection (if needed) */}
              {roomsCount > 1 && (
                <div className="mt-5 pt-4" style={{ borderTop: "1px solid #e0e0e0" }}>
                  <h5 style={{ color: "#1a3a52", marginBottom: "20px" }}>
                    Allocate Rooms
                  </h5>
                  <div className="row g-3">
                    {roomSelections.map((sel, idx) => {
                      const totalGuests = adults + children;
                      const minimalPerRoom = Math.ceil(totalGuests / roomsCount) || 1;
                      const options = availableRoomsInfo.filter((info) => {
                        const cap = roomCapacities[info.id];
                        if (!cap) return true;
                        // A simplified multi-room logic:
                        // Distribute adults and children evenly across the requested rooms
                        const approxAdults = Math.ceil(adults / roomsCount);
                        const approxChildren = Math.ceil(children / roomsCount);
                        const approxTotal = Math.ceil(totalGuests / roomsCount);

                        return approxAdults <= cap.maxAdults &&
                          approxChildren <= cap.maxChildren &&
                          approxTotal <= cap.totalMax &&
                          info.availableRooms > 0;
                      });
                      return (
                        <div key={`sel-${idx}`} className="col-md-6">
                          <label className="form-label" style={{ fontWeight: "600", marginBottom: "8px" }}>
                            Room {idx + 1}
                          </label>
                          <select
                            className="form-select"
                            value={sel}
                            onChange={(e) => {
                              const copy = [...roomSelections];
                              copy[idx] = e.target.value;
                              setRoomSelections(copy);
                            }}
                            style={{
                              borderRadius: "4px",
                              borderColor: "#ddd",
                              padding: "10px",
                            }}
                          >
                            <option value="">Select room category</option>
                            {options.map((o) => (
                              <option key={o.id} value={o.id}>
                                {o.name} — {o.availableRooms} left — Rs. {o.rate}/night
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* No rooms message */}
      {!isCheckingAvailability && availabilityMessage && availableRoomsInfo.length === 0 && (
        <div className="mt-5">
          <div className="alert alert-warning text-center py-5">
            <i className="fas fa-inbox" style={{ fontSize: "48px", marginBottom: "15px", display: "block", color: "#ff9800" }}></i>
            <h5 style={{ marginBottom: "10px" }}>No Rooms Available</h5>
            <p className="mb-0">
              We don't have any available rooms for {checkIn && formatDateToISO(checkIn)}. Please try a different date.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
