import React, { useState } from "react";
import emailjs from "@emailjs/browser";

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSending, setForgotSending] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");

  // Admin password - prioritize env variable over localStorage
  const getAdminPassword = () => {
    const envPassword = process.env.REACT_APP_ADMIN_PASSWORD;
    const storedPassword = localStorage.getItem("adminPassword");
    
    // If env password exists, use it (unless a temp password was just set)
    if (envPassword) {
      return envPassword;
    }
    
    // Fall back to stored password
    return storedPassword || "Sampath@1234";
  };

  const getAdminEmail = () => {
    return localStorage.getItem("adminEmail") || process.env.REACT_APP_ADMIN_EMAIL || "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const ADMIN_PASSWORD = getAdminPassword();
      console.log("Checking password - Input:", password, "Expected:", ADMIN_PASSWORD);
      console.log("localStorage.adminPassword:", localStorage.getItem("adminPassword"));
      console.log("process.env.REACT_APP_ADMIN_PASSWORD:", process.env.REACT_APP_ADMIN_PASSWORD);
      if (password === ADMIN_PASSWORD) {
        onLogin("admin-token-" + Date.now());
        setLoading(false);
      } else {
        setError("Invalid password. Please try again.");
        setPassword("");
        setLoading(false);
      }
    }, 500);
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotMessage("");
    setForgotSending(true);

    try {
      const configuredEmail = getAdminEmail();
      
      // Verify email is provided
      if (!forgotEmail) {
        setForgotMessage("❌ Please enter an email address.");
        setForgotSending(false);
        return;
      }

      // Verify email matches stored admin email
      if (configuredEmail && configuredEmail !== forgotEmail) {
        setForgotMessage("❌ The provided email does not match the admin email on record: " + configuredEmail);
        setForgotSending(false);
        return;
      }

      // Check if EmailJS is configured (REQUIRED for password reset)
      const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
      const adminTemplateID = process.env.REACT_APP_EMAILJS_ADMIN_RESET_TEMPLATE_ID;
      const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

      if (!serviceID || !adminTemplateID || !publicKey) {
        setForgotMessage("❌ Email service is not configured. Please contact the administrator. Cannot reset password via email.");
        setForgotSending(false);
        return;
      }

      // Generate temporary password
      const temp = Math.random().toString(36).slice(-8) + "A1";

      // Send via EmailJS
      try {
        const params = {
          to_email: forgotEmail,
          temp_password: temp,
        };
        await emailjs.send(serviceID, adminTemplateID, params, publicKey);
        
        // Only save to localStorage after email is sent successfully
        localStorage.setItem("adminPassword", temp);
        
        setForgotMessage("✅ Temporary password sent to: " + forgotEmail + "\n\nCheck your email for the temporary password.");
        setForgotEmail("");
      } catch (emailErr) {
        console.error("EmailJS error:", emailErr);
        setForgotMessage("❌ Failed to send email. Check your email configuration.");
      }
    } catch (err) {
      console.error("Password reset failed:", err);
      setForgotMessage("❌ An error occurred. Please try again.");
    } finally {
      setForgotSending(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <h1>Admin Login</h1>
          <p>Sampath Residency</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className={`form-control ${error ? "is-invalid" : ""}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter admin password"
              disabled={loading}
            />
            {error && <div className="invalid-feedback d-block">{error}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 admin-login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{ marginTop: 12, display: "flex", gap: "8px" }}>
          <button 
            type="button" 
            style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer", textDecoration: "underline", padding: 0, fontSize: "1rem", fontFamily: "inherit" }}
            onClick={() => setShowForgot(!showForgot)}
          >
            Forgot password?
          </button>
          <button 
            type="button" 
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              localStorage.removeItem("adminPassword");
              setError("Temporary password cleared. Please try again.");
            }}
          >
            Clear Temp Password
          </button>
        </div>

        {showForgot && (
          <div className="card mt-3 p-3" style={{ border: "2px solid #007bff" }}>
            <h5>🔐 Reset Admin Password</h5>
            <p className="small text-muted">A temporary password will be sent to your admin email.</p>
            <form onSubmit={handleForgotSubmit}>
              <div className="mb-2">
                <label className="form-label">Admin Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="sampathresidencyatpalani@gmail.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              <div className="d-flex gap-2 mb-2">
                <button className="btn btn-secondary" type="button" onClick={() => { setShowForgot(false); setForgotMessage(""); }} disabled={forgotSending}>
                  Cancel
                </button>
                <button className="btn btn-primary flex-grow-1" type="submit" disabled={forgotSending}>
                  {forgotSending ? "Sending..." : "Send Password Reset Email"}
                </button>
              </div>
              <button 
                className="btn btn-outline-info btn-sm w-100"
                type="button"
                onClick={() => {
                  localStorage.removeItem("adminPassword");
                  setForgotMessage("✅ Password reset to default: Sampath@1234");
                }}
              >
                Or Reset to Default Password (Sampath@1234)
              </button>
            </form>

            {forgotMessage && (
              <div className={`mt-3 p-3 border rounded ${forgotMessage.includes("✅") ? "bg-success text-white" : "bg-danger text-white"}`}>
                <small style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", display: "block" }}>
                  {forgotMessage}
                </small>
              </div>
            )}
          </div>
        )}

        <div className="admin-login-footer">
          <p>
            <small>This is a protected admin area.</small>
          </p>
        </div>
      </div>
    </div>
  );
}
