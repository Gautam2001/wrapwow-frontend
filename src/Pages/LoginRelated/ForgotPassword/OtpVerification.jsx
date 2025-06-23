import React, { useState } from "react";
import BrandLogo from "../../../Assets/GiftersLogo.png";
import "./OtpVerification.css";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../../api/AxiosInstance";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";

const OtpVerification = () => {
  const navigate = useNavigate();
  const { showPopup } = usePopup();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const HandleSendOtp = async () => {
    if (!email.trim()) {
      showPopup("Email field is required.", "error");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      showPopup("Invalid Email format.", "error");
      return;
    }

    try {
      const response = await AxiosInstance.post("/member/sendOtp", null, {
        params: { email },
      });

      if (response.data.status === "0") {
        showPopup(response.data.mesage, "error");
        return;
      }
      const result = response.data.resultString;

      if (result.resultStatus === "0") {
        showPopup(result.result, "error");
        return;
      } else {
        showPopup("OTP : " + result.OTP, "success");
        setShowOtp(true);
      }
    } catch (err) {
      if (err.response) {
        showPopup("Sending OTP failed. Please try again.", "error");
      } else {
        showPopup("An error occurred. Please check your connection.", "error");
      }
    }
  };

  const HandleOtpVerification = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      showPopup("OTP field is required.", "error");
      return;
    }
    if (otp.length !== 6) {
      showPopup("OTP should be of 6 digits.", "error");
      return;
    }

    try {
      const response = await AxiosInstance.post("/member/validateOtp", {
        email,
        password: otp,
      });

      if (response.data.status === "0") {
        showPopup(response.data.mesage, "error");
        return;
      }
      const result = response.data.resultString;

      if (result.resultStatus === "0") {
        showPopup(result.result, "error");
        return;
      } else {
        showPopup(result.result, "success");
        setShowOtp(false);
        navigate("/forgot-password", { state: { email } });
      }
    } catch (err) {
      if (err.response) {
        showPopup("Validating OTP failed. Please try again.", "error");
      } else {
        showPopup("An error occurred. Please check your connection.", "error");
      }
    }
  };

  return (
    <div className="ov-page">
      <div className="ov-container">
        <div className="ov-brand-title">
          <img
            src={BrandLogo}
            alt="Gift Carders Logo"
            className="ov-brand-logo"
          />
        </div>
        <form onSubmit={HandleOtpVerification}>
          <h2 className="ov-title">OTP VERIFICATION</h2>
          <div className="ov-form">
            {!showOtp && (
              <>
                <label className="ov-label">Email Id: </label>
                <input
                  className="ov-field"
                  type="email"
                  name="email"
                  placeholder="Enter your Email Id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="ov-button">
                  <button
                    className="ov-submit-button"
                    type="button"
                    onClick={HandleSendOtp}
                  >
                    Send OTP
                  </button>
                </div>
              </>
            )}
            {showOtp && (
              <>
                <label className="ov-label">Email Id: </label>
                <input
                  className="ov-field"
                  type="email"
                  name="email"
                  placeholder="Enter your Email Id"
                  disabled={true}
                  value={email}
                />
                <label className="ov-label">OTP: </label>
                <input
                  className="ov-field"
                  type="password"
                  name="otp"
                  placeholder="Enter OTP"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setOtp(value);
                    }
                  }}
                />
                <div className="ov-buttons">
                  <button className="ov-submit-button" type="submit">
                    Verify OTP
                  </button>
                  <button
                    className="ov-resendotp-button"
                    type="button"
                    onClick={HandleSendOtp}
                  >
                    Resend OTP
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
