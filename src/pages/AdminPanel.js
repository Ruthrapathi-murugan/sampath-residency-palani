import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLogin from "../components/admin/AdminLogin";
import AdminDashboard from "../components/admin/AdminDashboard";
import "../css/admin.css";

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is already logged in (from localStorage)
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("adminToken", token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="admin-panel">
      {isLoggedIn ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </div>
  );
}
