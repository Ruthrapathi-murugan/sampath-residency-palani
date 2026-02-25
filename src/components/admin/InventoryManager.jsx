import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function InventoryManager() {
  const [inventoryData, setInventoryData] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const roomTypes = [
    { id: 1, name: "Double bed A/C", availableRooms: 5 },
    { id: 2, name: "Triple Bed A/C", availableRooms: 5 },
    { id: 3, name: "Four Bed A/C", availableRooms: 5 },
    { id: 4, name: "Five Bed A/C", availableRooms: 5 },
  ];

  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, "dailyData", selectedDate);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.inventory) {
            setInventoryData((prev) => ({
              ...prev,
              [selectedDate]: data.inventory
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching inventory:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!inventoryData[selectedDate]) {
      fetchInventory();
    }
  }, [selectedDate]);

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const currentInventoryToSave = inventoryData[selectedDate] || {};

      const docRef = doc(db, "dailyData", selectedDate);
      await setDoc(docRef, {
        inventory: currentInventoryToSave
      }, { merge: true });

      setSuccessMessage("Inventory saved to Cloud correctly!");
    } catch (err) {
      console.error("Error saving inventory to cloud:", err);
      alert("Failed to save inventory to the cloud.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
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
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={isSaving || isLoading}
        >
          {isSaving ? (
            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Saving...</>
          ) : (
            <><i className="fa fa-cloud-upload"></i> Save Inventory to Cloud</>
          )}
        </button>
      </div>
    </div>
  );
}
