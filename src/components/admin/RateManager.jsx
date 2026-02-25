import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function RateManager() {
  const [ratesData, setRatesData] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bulkPercentage, setBulkPercentage] = useState(0);
  const [bulkFixedAmount, setBulkFixedAmount] = useState(0);
  const [bulkMode, setBulkMode] = useState("percentage");
  const [dateRange, setDateRange] = useState("single");
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);

  const roomTypes = [
    { id: 1, name: "Double bed A/C", defaultRate: 2500 }, // updated defaults to match Data.jsx roughly
    { id: 2, name: "Triple Bed A/C", defaultRate: 3500 },
    { id: 3, name: "Four Bed A/C", defaultRate: 3500 },
    { id: 4, name: "Five Bed A/C", defaultRate: 4000 },
  ];

  // Load rates for the currently visible date range (simplified to just load the selected date for now)
  useEffect(() => {
    const fetchRates = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, "dailyData", selectedDate);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.rates) {
            setRatesData((prev) => ({
              ...prev,
              [selectedDate]: data.rates
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching rates:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // We only fetch if we don't already have it in local state
    if (!ratesData[selectedDate]) {
      fetchRates();
    }
  }, [selectedDate]);

  const getRatesForDate = (date) => {
    return ratesData[date] || {};
  };

  const handleRateChange = (roomId, newRate) => {
    const newRates = {
      ...ratesData,
      [selectedDate]: {
        ...getRatesForDate(selectedDate),
        [roomId]: parseInt(newRate) || 0,
      },
    };
    setRatesData(newRates);
  };

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

  const applyBulkRateChange = () => {
    const datesToUpdate = dateRange === "range"
      ? getDatesInRange(selectedDate, endDate)
      : [selectedDate];

    if (bulkMode === "percentage" && bulkPercentage === 0) {
      alert("Please enter a percentage value");
      return;
    }
    if (bulkMode === "fixed" && bulkFixedAmount === 0) {
      alert("Please enter an amount");
      return;
    }

    const newRates = { ...ratesData };

    datesToUpdate.forEach((date) => {
      newRates[date] = newRates[date] || {};

      roomTypes.forEach((room) => {
        const currentRate = newRates[date][room.id] || room.defaultRate;

        if (bulkMode === "percentage") {
          newRates[date][room.id] = Math.round(currentRate * (1 + bulkPercentage / 100));
        } else {
          newRates[date][room.id] = currentRate + parseInt(bulkFixedAmount);
        }
      });
    });

    setRatesData(newRates);
    setSuccessMessage(`✅ Bulk rate updated for ${datesToUpdate.length} date(s)!`);
    setTimeout(() => setSuccessMessage(""), 3000);

    // Reset bulk form
    setBulkPercentage(0);
    setBulkFixedAmount(0);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Get the rates we modified for the currently selected date
      const currentRatesToSave = ratesData[selectedDate] || {};

      const docRef = doc(db, "dailyData", selectedDate);
      await setDoc(docRef, {
        rates: currentRatesToSave
      }, { merge: true });

      // In a real app with Bulk range edits, we would loop over all dirty dates and do batched writes here
      // For immediate synchronization, the current logic relies on them pressing Save on the specific date they are viewing.

      setSuccessMessage("✅ Cloud Rates saved successfully!");
    } catch (err) {
      console.error("Error saving rates to cloud:", err);
      alert("Failed to save rates to the cloud.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const currentDayRates = getRatesForDate(selectedDate);

  return (
    <div className="rate-manager">
      <h3>💰 Rate Management</h3>

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
        </div>
      )}

      {/* Bulk Rate Change Section */}
      <div className="card mb-4 border-primary">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">🚀 Bulk Rate Change</h5>
        </div>
        <div className="card-body">
          <div className="row g-3 mb-3">
            <div className="col-md-3">
              <label className="form-label">Apply to:</label>
              <select
                className="form-select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="single">Single Date</option>
                <option value="range">Date Range</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">From Date:</label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {dateRange === "range" && (
              <div className="col-md-3">
                <label className="form-label">To Date:</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            )}

            <div className="col-md-3">
              <label className="form-label">Change Type:</label>
              <select
                className="form-select"
                value={bulkMode}
                onChange={(e) => setBulkMode(e.target.value)}
              >
                <option value="percentage">% Increase/Decrease</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">
                {bulkMode === "percentage" ? "Percentage (%)" : "Amount (₹)"}
              </label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder={bulkMode === "percentage" ? "e.g., 10 for +10%" : "e.g., 100"}
                  value={bulkMode === "percentage" ? bulkPercentage : bulkFixedAmount}
                  onChange={(e) =>
                    bulkMode === "percentage"
                      ? setBulkPercentage(parseInt(e.target.value) || 0)
                      : setBulkFixedAmount(parseInt(e.target.value) || 0)
                  }
                />
                <span className="input-group-text">{bulkMode === "percentage" ? "%" : "₹"}</span>
              </div>
              <small className="text-muted">
                {bulkMode === "percentage"
                  ? "Positive = increase, Negative = decrease"
                  : "Added to all room rates"}
              </small>
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button
                className="btn btn-success w-100"
                onClick={applyBulkRateChange}
              >
                📊 Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Rate Management */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Individual Room Rates</h5>
        </div>
        <div className="card-body">
          <div className="admin-form-group mb-3">
            <label>Select Date:</label>
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="rate-table-container">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Room Type</th>
                  <th>Default Rate (₹)</th>
                  <th>Current Rate (₹)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {roomTypes.map((room) => {
                  const currentRate =
                    currentDayRates[room.id] !== undefined
                      ? currentDayRates[room.id]
                      : room.defaultRate;

                  return (
                    <tr key={room.id}>
                      <td>{room.name}</td>
                      <td>₹{room.defaultRate}</td>
                      <td>
                        <div className="input-group" style={{ maxWidth: "150px" }}>
                          <span className="input-group-text">₹</span>
                          <input
                            type="number"
                            min="0"
                            className="form-control rate-input"
                            value={currentRate}
                            onChange={(e) =>
                              handleRateChange(room.id, e.target.value)
                            }
                          />
                        </div>
                      </td>
                      <td>
                        {currentRate !== room.defaultRate && (
                          <span className="badge bg-warning text-dark">
                            {currentRate > room.defaultRate ? "📈 Higher" : "📉 Lower"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="admin-actions mt-3">
        <button
          className="btn btn-primary btn-lg"
          onClick={handleSave}
          disabled={isSaving || isLoading}
        >
          {isSaving ? (
            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Saving to Cloud...</>
          ) : (
            <><i className="fa fa-cloud-upload"></i> Save Rates to Cloud</>
          )}
        </button>
      </div>
    </div>
  );
}
