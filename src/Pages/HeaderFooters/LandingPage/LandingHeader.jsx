import React, { useState, useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa";
import BrandLogo from "../../../Assets/GiftersLogoW.png";
import "./LandingHeader.css";
import { useNavigate } from "react-router-dom";

const LandingHeader = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

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
    <div className="lh-page">
      <div className="lh-container">
        {/* Logo Section */}
        <div className="lh-col1" onClick={() => navigate("/")}>
          <img src={BrandLogo} alt="Logo" className="lh-brand-img" />
          <span className="lh-subtitle">Shop Smarter. Gift Better.</span>
        </div>

        {/* Login Icon */}
        <div className="lh-col2">
          <div
            className="lh-user"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaUser className="lh-icon" />
            <span className="lh-name">Login</span>
          </div>

          {showDropdown && (
            <div className="lh-dropdown" ref={dropdownRef}>
              <p onClick={() => navigate("/login")}>Log In</p>
              <p onClick={() => navigate("/signup")}>Sign Up</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingHeader;
