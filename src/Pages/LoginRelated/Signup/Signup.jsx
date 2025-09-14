import React, { useEffect, useState } from "react";
import "./Signup.css";
import BrandLogo from "../../../Assets/GiftersLogo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { useApiClients } from "../../../api/useApiClients";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || "";
  const { showPopup } = usePopup();
  const { loginApi, wrapwowApi } = useApiClients();

  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  useEffect(() => {
    if (!username) {
      showPopup("Invalid or expired OTP link", "error");
      navigate("/signup");
    }
  }, [username, navigate, showPopup]);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleResendOtp = async () => {
    if (!username) {
      return showPopup("Username cannot be blank.", "error");
    }

    if (!isValidEmail(username)) {
      return showPopup("Enter a valid email address.", "error");
    }

    try {
      const res = await loginApi.post("/auth/signup-resend-otp", { username });
      if (res.data.status === "0") {
        showPopup(
          res.data.message || "OTP Sent Successfully to Email.",
          "success"
        );
      } else {
        showPopup(res.data.message || "Cannot send OTP, try again.", "error");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Network error while loading contacts.";
      showPopup(msg, "error");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !otp) {
      return showPopup("Please fill in all fields.", "error");
    }

    if (!isValidEmail(username)) {
      return showPopup("Enter a valid email address.", "error");
    }

    if (!/^\d{6}$/.test(otp)) {
      return showPopup("OTP must be a 6-digit number.", "error");
    }

    setStatus("loading");

    try {
      const signupRes = await loginApi.post("/auth/signup", {
        username,
        otp,
      });

      if (signupRes.data.status === "0") {
        // Continue to join
        const joinRes = await wrapwowApi.post("/member/join", {
          email: username,
        });

        const singupData = joinRes.data;

        if (singupData.status === "0") {
          showPopup(singupData.message || "Signup successful!", "success");
          navigate("/login");
        } else {
          showPopup(
            singupData.message || "Signup successful!, please join...",
            "success"
          );
          navigate("/join");
        }
      } else {
        showPopup(
          signupRes.data.message || "Email is already registered.",
          "error"
        );
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Network error. Please try again.";
      showPopup(message, "error");
    } finally {
      setStatus("");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-brand-title">
          <img
            src={BrandLogo}
            alt="Gift Carders Logo"
            className="login-brand-logo"
          />
          <p>A GIFTING RETREAT</p>
        </div>

        <form onSubmit={handleSignup}>
          <h2 className="signup-title">SIGNUP OTP</h2>
          <div className="signup-form">
            <label className="signup-label">Email Id</label>
            <input
              className="signup-field"
              type="email"
              placeholder="Enter your email"
              value={username}
              disabled
              required
            />

            <label className="signup-label">OTP</label>
            <input
              className="signup-field"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,6}$/.test(value)) setOtp(value);
              }}
              required
            />
          </div>

          <button
            className="signup-button"
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            <a
              onClick={(e) => {
                e.preventDefault();
                handleResendOtp();
              }}
            >
              Resend OTP
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
