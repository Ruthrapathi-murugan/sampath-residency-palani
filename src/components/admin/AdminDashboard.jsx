import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InventoryManager from "./InventoryManager";
import RateManager from "./RateManager";
import RoomBlockingManager from "./RoomBlockingManager";
import BookingManager from "./BookingManager";
import BulkManager from "./BulkManager";
import "../../css/admin.css";

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("inventory");
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      onLogout();
      navigate("/");
    }
  };

  const changePassword = () => {
    const currentStored = localStorage.getItem("adminPassword") || process.env.REACT_APP_ADMIN_PASSWORD || "Sampath@1234";
    const current = window.prompt("Enter current admin password:");
    if (current === null) return; // cancelled
    if (current !== currentStored) {
      alert("Current password is incorrect.");
      return;
    }
    const next = window.prompt("Enter new admin password:");
    if (!next) {
      alert("Password not changed.");
      return;
    }
    const confirm = window.prompt("Confirm new admin password:");
    if (confirm !== next) {
      alert("Passwords do not match. Try again.");
      return;
    }
    localStorage.setItem("adminPassword", next);
    alert("Admin password updated successfully.");
  };

  return (
    <div className="admin-dashboard">
      {/* Admin Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-branding">
            <h2>Sampath Residency Admin</h2>
            <p>Management Panel</p>
          </div>
          <div>
            <button
              className="btn btn-secondary me-2"
              onClick={changePassword}
            >
              <i className="fa fa-key"></i> Change Password
            </button>
            <button
              className="btn btn-danger admin-logout-btn"
              onClick={handleLogout}
            >
              <i className="fa fa-sign-out"></i> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "bulk" ? "active" : ""}`}
          onClick={() => setActiveTab("bulk")}
        >
          <i className="fa fa-flash"></i> Bulk Manager
        </button>
        <button
          className={`tab-btn ${activeTab === "inventory" ? "active" : ""}`}
          onClick={() => setActiveTab("inventory")}
        >
          <i className="fa fa-boxes"></i> Inventory
        </button>
        <button
          className={`tab-btn ${activeTab === "rates" ? "active" : ""}`}
          onClick={() => setActiveTab("rates")}
        >
          <i className="fa fa-tags"></i> Rates
        </button>
        <button
          className={`tab-btn ${activeTab === "blocking" ? "active" : ""}`}
          onClick={() => setActiveTab("blocking")}
        >
          <i className="fa fa-lock"></i> Room Blocking
        </button>
        <button
          className={`tab-btn ${activeTab === "bookings" ? "active" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          <i className="fa fa-calendar-check"></i> Bookings
        </button>
      </div>

      {/* Tab Content */}
      <div className="admin-content">
        {activeTab === "bulk" && <BulkManager />}
        {activeTab === "inventory" && <InventoryManager />}
        {activeTab === "rates" && <RateManager />}
        {activeTab === "blocking" && <RoomBlockingManager />}
        {activeTab === "bookings" && <BookingManager />}
      </div>
    </div>
  );
}
