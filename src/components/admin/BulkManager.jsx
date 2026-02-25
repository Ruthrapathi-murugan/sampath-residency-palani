import React, { useState, useEffect } from "react";
import "../../css/admin.css";

export default function BulkManager() {
  const [ratesData, setRatesData] = useState({});
  const [inventoryData, setInventoryData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Bulk Update Form States
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [selectedRooms, setSelectedRooms] = useState({});
  const [bulkRate, setBulkRate] = useState("");
  const [bulkInventory, setBulkInventory] = useState("");
  const [rateMode, setRateMode] = useState("fixed"); // "fixed" or "percentage"
  const [inventoryMode, setInventoryMode] = useState("fixed"); // "fixed" or "percentage"

  const roomTypes = [
    { id: 1, name: "Double bed A/C", defaultRate: 1800, totalRooms: 5 },
    { id: 2, name: "Triple Bed A/C", defaultRate: 2000, totalRooms: 5 },
    { id: 3, name: "Four Bed A/C", defaultRate: 2200, totalRooms: 5 },
    { id: 4, name: "Five Bed A/C", defaultRate: 2400, totalRooms: 5 },
  ];

  useEffect(() => {
    // Load data from localStorage
    const savedRates = localStorage.getItem("ratesData");
    const savedInventory = localStorage.getItem("inventoryData");
    if (savedRates) setRatesData(JSON.parse(savedRates));
    if (savedInventory) setInventoryData(JSON.parse(savedInventory));

    // Initialize all rooms as selected
    const allRooms = {};
    roomTypes.forEach((room) => {
      allRooms[room.id] = true;
    });
    setSelectedRooms(allRooms);
  }, []);

  // Get all dates in range
  const getDatesInRange = (start, end) => {
    const dates = [];
    const current = new Date(start);
    const endDateObj = new Date(end);

    while (current <= endDateObj) {
      dates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  // Toggle room selection
  const toggleRoom = (roomId) => {
    setSelectedRooms({
      ...selectedRooms,
      [roomId]: !selectedRooms[roomId],
    });
  };

  // Select all rooms
  const selectAllRooms = () => {
    const allRooms = {};
    roomTypes.forEach((room) => {
      allRooms[room.id] = true;
    });
    setSelectedRooms(allRooms);
  };

  // Deselect all rooms
  const deselectAllRooms = () => {
    const allRooms = {};
    roomTypes.forEach((room) => {
      allRooms[room.id] = false;
    });
    setSelectedRooms(allRooms);
  };

  // Apply bulk updates
  const applyBulkUpdate = () => {
    const datesInRange = getDatesInRange(startDate, endDate);
    const selectedRoomIds = Object.keys(selectedRooms)
      .filter((id) => selectedRooms[id])
      .map((id) => parseInt(id));

    if (selectedRoomIds.length === 0) {
      alert("⚠️ Please select at least one room");
      return;
    }

    if (!bulkRate && !bulkInventory) {
      alert("⚠️ Please enter either a rate or inventory value");
      return;
    }

    // Update Rates
    if (bulkRate) {
      const newRates = { ...ratesData };
      datesInRange.forEach((date) => {
        newRates[date] = newRates[date] || {};
        selectedRoomIds.forEach((roomId) => {
          const room = roomTypes.find((r) => r.id === roomId);
          const currentRate = newRates[date][roomId] || room.defaultRate;

          if (rateMode === "fixed") {
            newRates[date][roomId] = parseInt(bulkRate);
          } else {
            // Percentage mode
            newRates[date][roomId] = Math.round(currentRate * (1 + parseInt(bulkRate) / 100));
          }
        });
      });
      setRatesData(newRates);
      localStorage.setItem("ratesData", JSON.stringify(newRates));
    }

    // Update Inventory
    if (bulkInventory) {
      const newInventory = { ...inventoryData };
      datesInRange.forEach((date) => {
        newInventory[date] = newInventory[date] || {};
        selectedRoomIds.forEach((roomId) => {
          if (inventoryMode === "fixed") {
            newInventory[date][roomId] = Math.max(0, parseInt(bulkInventory));
          } else {
            // Percentage mode
            const room = roomTypes.find((r) => r.id === roomId);
            const currentInv = newInventory[date][roomId] || room.totalRooms;
            newInventory[date][roomId] = Math.round(
              currentInv * (1 + parseInt(bulkInventory) / 100)
            );
          }
        });
      });
      setInventoryData(newInventory);
      localStorage.setItem("inventoryData", JSON.stringify(newInventory));
    }

    // Show success
    const roomCount = selectedRoomIds.length;
    const dateCount = datesInRange.length;
    setSuccessMessage(
      `✅ Updated ${roomCount} room(s) × ${dateCount} date(s) = ${roomCount * dateCount} entries!`
    );
    setTimeout(() => setSuccessMessage(""), 4000);

    // Reset form
    setBulkRate("");
    setBulkInventory("");
  };

  const selectedRoomCount = Object.values(selectedRooms).filter(Boolean).length;
  const dateCount = getDatesInRange(startDate, endDate).length;

  return (
    <div className="admin-panel-section p-4">
      <h3>🚀 Bulk Inventory & Rate Manager</h3>

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <strong>{successMessage}</strong>
        </div>
      )}

      <div className="card border-primary mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">📅 Date Range Selection</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-5">
              <label className="form-label fw-bold">Start Date</label>
              <input
                type="date"
                className="form-control form-control-lg"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-5">
              <label className="form-label fw-bold">End Date</label>
              <input
                type="date"
                className="form-control form-control-lg"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <div className="bg-light p-3 rounded w-100 text-center">
                <small className="text-muted">Days</small>
                <h5 className="mb-0">{dateCount}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-success mb-4">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">🛏️ Room Selection</h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <button
              className="btn btn-sm btn-outline-success me-2"
              onClick={selectAllRooms}
            >
              ✓ Select All
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={deselectAllRooms}
            >
              ✕ Deselect All
            </button>
            <span className="ms-3 badge bg-info">
              {selectedRoomCount} of {roomTypes.length} selected
            </span>
          </div>

          <div className="row g-3">
            {roomTypes.map((room) => (
              <div key={room.id} className="col-md-6">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`room-${room.id}`}
                    checked={selectedRooms[room.id] || false}
                    onChange={() => toggleRoom(room.id)}
                  />
                  <label className="form-check-label" htmlFor={`room-${room.id}`}>
                    <strong>{room.name}</strong>
                    <br />
                    <small className="text-muted">
                      Default: ₹{room.defaultRate}/night | {room.totalRooms} rooms
                    </small>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Rate Update Section */}
        <div className="col-lg-6">
          <div className="card border-warning">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">💰 Update Rates</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-bold">Rate Mode</label>
                <select
                  className="form-select"
                  value={rateMode}
                  onChange={(e) => setRateMode(e.target.value)}
                >
                  <option value="fixed">📌 Set Fixed Rate (₹)</option>
                  <option value="percentage">📊 Percentage Change (%)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">
                  {rateMode === "fixed" ? "Fixed Rate (₹)" : "Percentage (%)"}
                </label>
                <div className="input-group input-group-lg">
                  <input
                    type="number"
                    className="form-control"
                    placeholder={rateMode === "fixed" ? "e.g., 2000" : "e.g., 10 for +10%"}
                    value={bulkRate}
                    onChange={(e) => setBulkRate(e.target.value)}
                  />
                  <span className="input-group-text">
                    {rateMode === "fixed" ? "₹" : "%"}
                  </span>
                </div>
                <small className="text-muted d-block mt-2">
                  {rateMode === "fixed"
                    ? "All rooms will be set to this rate"
                    : "Positive = increase, Negative = decrease"}
                </small>
              </div>

              <div className="alert alert-info">
                <strong>Preview:</strong>
                {bulkRate ? (
                  <div>
                    {rateMode === "fixed" ? (
                      <>
                        <br />
                        All selected rooms → ₹{bulkRate}/night
                      </>
                    ) : (
                      <>
                        <br />
                        All rates will change by {bulkRate}%
                      </>
                    )}
                  </div>
                ) : (
                  "Enter a value to see preview"
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Update Section */}
        <div className="col-lg-6">
          <div className="card border-info">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">📦 Update Inventory</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-bold">Inventory Mode</label>
                <select
                  className="form-select"
                  value={inventoryMode}
                  onChange={(e) => setInventoryMode(e.target.value)}
                >
                  <option value="fixed">📌 Set Available Rooms</option>
                  <option value="percentage">📊 Percentage Change (%)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">
                  {inventoryMode === "fixed" ? "Available Rooms" : "Percentage (%)"}
                </label>
                <div className="input-group input-group-lg">
                  <input
                    type="number"
                    className="form-control"
                    placeholder={inventoryMode === "fixed" ? "e.g., 3" : "e.g., -20 for -20%"}
                    value={bulkInventory}
                    onChange={(e) => setBulkInventory(e.target.value)}
                  />
                  <span className="input-group-text">
                    {inventoryMode === "fixed" ? "rooms" : "%"}
                  </span>
                </div>
                <small className="text-muted d-block mt-2">
                  {inventoryMode === "fixed"
                    ? "Same number of rooms available for all selected dates"
                    : "Reduce or increase inventory by percentage"}
                </small>
              </div>

              <div className="alert alert-info">
                <strong>Preview:</strong>
                {bulkInventory ? (
                  <div>
                    {inventoryMode === "fixed" ? (
                      <>
                        <br />
                        All selected rooms → {bulkInventory} available rooms
                      </>
                    ) : (
                      <>
                        <br />
                        Inventory will change by {bulkInventory}%
                      </>
                    )}
                  </div>
                ) : (
                  "Enter a value to see preview"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary and Apply Button */}
      <div className="card border-secondary">
        <div className="card-header">
          <h5 className="mb-0">📊 Summary</h5>
        </div>
        <div className="card-body">
          <div className="row text-center mb-4">
            <div className="col-md-4">
              <div className="bg-light p-3 rounded">
                <h6 className="text-muted">Date Range</h6>
                <h4>{dateCount} days</h4>
                <small>{startDate} → {endDate}</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-light p-3 rounded">
                <h6 className="text-muted">Selected Rooms</h6>
                <h4>{selectedRoomCount}</h4>
                <small>of {roomTypes.length} total</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-light p-3 rounded">
                <h6 className="text-muted">Total Updates</h6>
                <h4>{selectedRoomCount * dateCount}</h4>
                <small>room × date combinations</small>
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary btn-lg w-100"
            onClick={applyBulkUpdate}
            disabled={selectedRoomCount === 0 || (!bulkRate && !bulkInventory)}
          >
            <i className="fa fa-flash"></i> Apply Bulk Update
          </button>
        </div>
      </div>
    </div>
  );
}
