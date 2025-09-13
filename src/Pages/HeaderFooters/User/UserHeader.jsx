import React, { useState, useEffect, useRef } from "react";
import { FaUser, FaSignOutAlt, FaShoppingCart } from "react-icons/fa";
import BrandLogo from "../../../Assets/GiftersLogoW.png";
import "./UserHeader.css";
import { useNavigate } from "react-router-dom";
//import AxiosInstance from "../../../api/AxiosInstance";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { useApiClients } from "../../../api/useApiClients";

const UserHeader = () => {
  const navigate = useNavigate();
  const { wrapwowApi } = useApiClients();
  const { showPopup } = usePopup();
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef(null);

  const loginData = sessionStorage.getItem("LoginData")
    ? JSON.parse(sessionStorage.getItem("LoginData"))
    : null;
  const name = loginData?.name || "Guest";

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const fetchCartQty = async () => {
      const loginData = JSON.parse(sessionStorage.getItem("LoginData"));
      const email = loginData?.username;

      try {
        const response = await wrapwowApi.get("/user/getCartQty", {
          params: { email },
        });
        const result = response.data;
        if (result.status === "1") {
          showPopup(result.message, "error");
        } else {
          setCartCount(result.CartQty);
        }
      } catch (err) {
        showPopup(
          err.response
            ? "Fetching cart failed. Please try again."
            : "An error occurred. Please check your connection.",
          "error"
        );
      }
    };

    fetchCartQty();

    const handleCartUpdate = () => {
      fetchCartQty();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [showPopup]);

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
    <div className="uh-page">
      <div className="uh-container">
        {/* Logo Section */}
        <div className="uh-col1" onClick={() => navigate("/dashboard")}>
          <img src={BrandLogo} alt="Logo" className="uh-brand-img" />
          <span className="uh-subtitle">Shop Smarter. Gift Better.</span>
        </div>

        {/* User Actions */}
        <div className="uh-col2">
          {/* Cart */}
          <div className="uh-cart-container" onClick={() => navigate("/cart")}>
            <FaShoppingCart className="uh-cart-icon" title="Cart" />
            {cartCount > 0 && (
              <span className="uh-cart-badge">{cartCount}</span>
            )}
          </div>

          {/* User Dropdown */}
          <div
            className="uh-user"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaUser className="uh-icon" />
            <span className="uh-name">{name}</span>
          </div>

          {showDropdown && (
            <div className="uh-dropdown" ref={dropdownRef}>
              <p onClick={() => navigate("/reset-password")}>Reset Password</p>
              <p onClick={() => navigate("/my-orders")}>My Orders</p>
              <p onClick={handleLogout}>
                Logout <FaSignOutAlt style={{ marginLeft: "6px" }} />
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
