import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function RoomBlockingManager() {
  const [blockingData, setBlockingData] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const roomTypes = [
    { id: 1, name: "Double bed A/C" },
    { id: 2, name: "Triple Bed A/C" },
    { id: 3, name: "Four Bed A/C" },
    { id: 4, name: "Five Bed A/C" },
  ];

  useEffect(() => {
    const fetchBlocking = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, "dailyData", selectedDate);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.blocking) {
            setBlockingData((prev) => ({
              ...prev,
              [selectedDate]: data.blocking
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching blocking data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!blockingData[selectedDate]) {
      fetchBlocking();
    }
  }, [selectedDate]);

  const getBlockingForDate = (date) => {
    return blockingData[date] || {};
  };

  const handleBlockingChange = (roomId) => {
    const currentBlocking = getBlockingForDate(selectedDate);
    const isCurrentlyBlocked = currentBlocking[roomId] || false;

    const newBlocking = {
      ...blockingData,
      [selectedDate]: {
        ...currentBlocking,
        [roomId]: !isCurrentlyBlocked,
      },
    };
    setBlockingData(newBlocking);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const currentBlockingToSave = blockingData[selectedDate] || {};

      const docRef = doc(db, "dailyData", selectedDate);
      await setDoc(docRef, {
        blocking: currentBlockingToSave
      }, { merge: true });

      setSuccessMessage("Room blocking saved to Cloud correctly!");
    } catch (err) {
      console.error("Error saving blocking to cloud:", err);
      alert("Failed to save room locks to the cloud.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const currentDayBlocking = getBlockingForDate(selectedDate);
  const allRoomsBlocked = roomTypes.every((room) => currentDayBlocking[room.id]);

  return (
    <div className="room-blocking-manager">
      <h3>Room Blocking Management</h3>

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      {allRoomsBlocked && (
        <div className="alert alert-danger" role="alert">
          <i className="fa fa-exclamation-circle"></i> <strong>All rooms are blocked!</strong> No bookings can be made for this date.
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

      <div className="blocking-container">
        <div className="row">
          {roomTypes.map((room) => {
            const isBlocked = currentDayBlocking[room.id] || false;

            return (
              <div className="col-md-6 col-lg-3 mb-4" key={room.id}>
                <div className={`blocking-card ${isBlocked ? "blocked" : ""}`}>
                  <div className="blocking-card-header">
                    <h5>{room.name}</h5>
                    {isBlocked && (
                      <span className="badge bg-danger">
                        <i className="fa fa-lock"></i> Blocked
                      </span>
                    )}
                  </div>

                  <div className="blocking-card-body">
                    <label className="blocking-toggle">
                      <input
                        type="checkbox"
                        checked={isBlocked}
                        onChange={() => handleBlockingChange(room.id)}
                      />
                      <span className="toggle-text">
                        {isBlocked ? "Room is Blocked" : "Room is Available"}
                      </span>
                    </label>
                  </div>

                  <div className="blocking-card-footer">
                    <small className="text-muted">
                      {isBlocked
                        ? "Customers cannot book this room"
                        : "Room is open for booking"}
                    </small>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
            <><i className="fa fa-cloud-upload"></i> Save Changes to Cloud</>
          )}
        </button>
      </div>

      {/* Info Box */}
      <div className="info-box mt-4">
        <h5>How Room Blocking Works:</h5>
        <ul>
          <li>Check the checkbox to block a room for the selected date</li>
          <li>Blocked rooms will not appear in booking options</li>
          <li>When all 4 rooms are blocked, the entire property is closed for that date</li>
          <li>Changes are saved immediately when you click "Save Changes"</li>
        </ul>
      </div>
    </div>
  );
}
