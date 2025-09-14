import React, { useEffect, useState } from "react";
import "./RequestSignup.css";
import BrandLogo from "../../../Assets/GiftersLogo.png";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { useApiClients } from "../../../api/useApiClients";

const RequestSignup = () => {
  const navigate = useNavigate();
  const { showPopup } = usePopup();
  const { loginApi, wrapwowApi } = useApiClients();

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [status, setStatus] = useState("");

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const isStrongPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !name || !password || !confirmPassword) {
      return showPopup("Please fill in all fields.", "error");
    }

    if (!isValidEmail(username)) {
      return showPopup("Enter a valid email address.", "error");
    }

    if (password !== confirmPassword) {
      return showPopup("Passwords do not match.", "error");
    }

    if (!isStrongPassword(password)) {
      return showPopup(
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",
        "error"
      );
    }

    setStatus("loading");

    try {
      const existsRes = await wrapwowApi.post("/member/exists", {
        email: username,
      });

      if (existsRes.data.status === "1") {
        // Continue to signup
        const signupRes = await loginApi.post("/auth/request-signup", {
          username,
          name,
          password,
          role,
        });

        const signupData = signupRes.data;

        if (signupData.status === "0") {
          showPopup(signupData.message || "Signup successful!", "success");
          navigate("/signup-otp", { state: { username } });
        } else {
          showPopup(signupData.message || "Signup failed.", "error");
        }
      } else {
        showPopup(
          existsRes.data.message || "Email is already registered.",
          "error"
        );
        navigate("/join");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Network error. Please try again.";
      showPopup(message, "error");
      console.log(err);
    } finally {
      setStatus("");
    }
  };

  return (
    <div className="req-signup-page">
      <div className="req-signup-container">
        <div className="req-signup-brand-title">
          <img
            src={BrandLogo}
            alt="Gift Carders Logo"
            className="req-signup-brand-logo"
          />
          <p>A GIFTING RETREAT</p>
        </div>

        <form onSubmit={handleSignup} className="req-signup-form">
          <div className="form-row">
            <div className="form-group">
              <label className="req-signup-label">Email Id</label>
              <input
                className="req-signup-field"
                type="email"
                placeholder="Enter your email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="req-signup-label">Name</label>
              <input
                className="req-signup-field"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="req-signup-label">Password</label>
              <input
                className="req-signup-field"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="req-signup-label">Confirm Password</label>
              <input
                className="req-signup-field"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="req-signup-label">Role</label>
              <select
                className="req-signup-field"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          <button
            className="req-signup-button"
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="req-signup-footer">
          <p>
            Already a member? <a href="/login">Log in here</a>
          </p>
          <p>
            Already have an account? <a href="/join">Join here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequestSignup;
