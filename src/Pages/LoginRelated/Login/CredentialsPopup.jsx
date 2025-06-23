import React from "react";
import "./CredentialsPopup.css";

const CredentialsPopup = ({ user, admin, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h1>LOGIN CREDENTIALS</h1>
        <div className="popup-message">
          <h2>User Credentials:</h2>
          {user}
          <h2>Admin Credentials:</h2>
          {admin}
        </div>
        <button className="popup-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CredentialsPopup;
