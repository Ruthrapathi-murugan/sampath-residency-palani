import React, { useState, useEffect } from "react";

export default function InventoryManager() {
  const [inventoryData, setInventoryData] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [successMessage, setSuccessMessage] = useState("");

  const roomTypes = [
    { id: 1, name: "Double bed A/C", availableRooms: 5 },
    { id: 2, name: "Triple Bed A/C", availableRooms: 5 },
    { id: 3, name: "Four Bed A/C", availableRooms: 5 },
    { id: 4, name: "Five Bed A/C", availableRooms: 5 },
  ];

  useEffect(() => {
    // Load inventory from localStorage
    const saved = localStorage.getItem("inventoryData");
    if (saved) {
      setInventoryData(JSON.parse(saved));
    }
  }, []);

  const getInventoryForDate = (date) => {
    return inventoryData[date] || {};
  };

  const handleInventoryChange = (roomId, newValue) => {
    const newInventory = {
      ...inventoryData,
      [selectedDate]: {
        ...getInventoryForDate(selectedDate),
        [roomId]: Math.max(0, parseInt(newValue) || 0),
      },
    };
    setInventoryData(newInventory);
  };

  const handleSave = () => {
    localStorage.setItem("inventoryData", JSON.stringify(inventoryData));
    setSuccessMessage("Inventory updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const currentDayInventory = getInventoryForDate(selectedDate);

  return (
    <div className="inventory-manager">
      <h3>Inventory Management</h3>

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      <div className="admin-form-group">
        <label>Select Date:</label>
        <input
          type="date"
          className="form-control"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="inventory-table-container">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Room Type</th>
              <th>Total Rooms</th>
              <th>Available Rooms</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {roomTypes.map((room) => (
              <tr key={room.id}>
                <td>{room.name}</td>
                <td>{room.availableRooms}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max={room.availableRooms}
                    className="form-control inventory-input"
                    value={currentDayInventory[room.id] !== undefined ? currentDayInventory[room.id] : room.availableRooms}
                    onChange={(e) => handleInventoryChange(room.id, e.target.value)}
                  />
                </td>
                <td>
                  <small className="text-muted">
                    {currentDayInventory[room.id] !== undefined
                      ? `${currentDayInventory[room.id]}/${room.availableRooms}`
                      : `${room.availableRooms}/${room.availableRooms}`}
                  </small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-actions">
        <button className="btn btn-primary" onClick={handleSave}>
          <i className="fa fa-save"></i> Save Inventory
        </button>
      </div>
    </div>
  );
}
