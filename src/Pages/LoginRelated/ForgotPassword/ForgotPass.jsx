import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
//import AxiosInstance from "../../../api/AxiosInstance";
import BrandLogo from "../../../Assets/GiftersLogo.png";
import "./ForgotPass.css";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";

const ForgotPass = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const { showPopup } = usePopup();
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  const HandleForgotPass = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      showPopup("All fields are required.", "error");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      showPopup(
        "Requires at least one lowercase letter, one uppercase letter, one number, and one special character.",
        "error"
      );
      return;
    }

    if (password !== confirmPassword) {
      showPopup("Password does not match.", "error");
      return;
    }

    try {
      const response = await AxiosInstance.post("/member/forgotPassword", {
        email,
        password,
      });

      if (response.data.status === "0") {
        showPopup(response.data.mesage, "error");
        return;
      }
      const result = response.data;

      if (result.status === "0") {
        showPopup(result.message, "error");
        return;
      } else {
        showPopup(result.message, "success");
        navigate("/login");
      }
    } catch (err) {
      if (err.response) {
        showPopup("Password Change failed. Please try again.", "error");
        navigate("/otp-verification");
      } else {
        showPopup("An error occurred. Please check your connection.", "error");
        navigate("/otp-verification");
      }
    }
  };

  return (
    <div className="fp-page">
      <div className="fp-container">
        <div className="fp-brand-title">
          <img
            src={BrandLogo}
            alt="Gift Carders Logo"
            className="ov-brand-logo"
          />
        </div>
        <form onSubmit={HandleForgotPass}>
          <h2 className="fp-title">FORGOT PASSWORD</h2>
          <div className="fp-form">
            <label className="fp-label">Email Id:</label>
            <input
              className="fp-field"
              type="email"
              name="email"
              placeholder="Enter your Email Id"
              value={email}
              disabled={true}
            />
            <label className="fp-label">New Password:</label>
            <input
              className="fp-field"
              type="password"
              name="password"
              placeholder="Enter your new Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="fp-label">Confirm New Password:</label>
            <input
              className="fp-field"
              type="password"
              name="confirmPassword"
              placeholder="Enter your Password again"
              value={confirmPassword}
              onChange={(e) => setconfirmPassword(e.target.value)}
            />
          </div>
          <div className="fp-buttons">
            <button className="fp-submit-button" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPass;
