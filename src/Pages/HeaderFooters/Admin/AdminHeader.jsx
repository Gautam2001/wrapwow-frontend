import React, { useState, useEffect, useRef } from "react";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import BrandLogo from "../../../Assets/GiftersLogoW.png";
import "./adminHeader.css";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { showPopup } = usePopup();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const loginData = sessionStorage.getItem("LoginData")
    ? JSON.parse(sessionStorage.getItem("LoginData"))
    : null;
  const name = loginData?.name || "Guest";

  const handleLogout = () => {
    sessionStorage.clear();
    showPopup("Logged out Successfully.");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="ah-page">
      <div className="ah-container">
        <div className="ah-col1" onClick={() => navigate("/admin-dashboard")}>
          <img src={BrandLogo} alt="Logo" className="ah-brand-img" />
        </div>

        <div className="ah-col2">
          <div className="ah-col-items">
            <div
              className="ah-user"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <FaUser className="ah-icon" />
              <span className="ah-name">{name}</span>
            </div>

            {showDropdown && (
              <div className="ah-dropdown" ref={dropdownRef}>
                <p onClick={() => navigate("/reset-password")}>
                  Reset Password
                </p>
                <p onClick={handleLogout}>
                  Logout <FaSignOutAlt />
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
