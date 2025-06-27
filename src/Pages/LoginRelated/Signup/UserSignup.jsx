import React, { useState } from "react";
import "./UserSignup.css";
import BrandLogo from "../../../Assets/GiftersLogo.png";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../../api/AxiosInstance";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";

const UserSignup = () => {
  const navigate = useNavigate();
  const { showPopup } = usePopup();

  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    dob: "",
  });

  const [showPasswordRules, setShowPasswordRules] = useState(false);

  const passwordValid = (password) => {
    const minLength = /.{8,}/;
    const upper = /[A-Z]/;
    const number = /\d/;
    const special = /[@$!%*?&]/;
    return (
      minLength.test(password) &&
      upper.test(password) &&
      number.test(password) &&
      special.test(password)
    );
  };

  const validateFields = () => {
    const { email, name, password, dob } = form;
    const errors = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    const today = new Date().toISOString().split("T")[0];

    if (!name.trim()) errors.push("Name is required.");
    else if (!nameRegex.test(name))
      errors.push(
        "Name must contain only letters and be at least 2 characters long."
      );

    if (!email.trim()) errors.push("Email is required.");
    else if (!emailRegex.test(email))
      errors.push("Enter a valid email address.");

    if (!password.trim()) errors.push("Password is required.");
    else if (!passwordValid(password))
      errors.push(
        "Password must be 8+ characters with uppercase, number, and special char."
      );

    if (!dob.trim()) errors.push("Date of birth is required.");
    else if (dob > today) errors.push("Date of birth cannot be in the future.");

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      const onlyLetters = /^[a-zA-Z\s]*$/;
      if (!onlyLetters.test(value)) return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("Form submission started", form);
    const errors = validateFields();
    console.log("Validation errors:", errors);
    if (errors.length > 0) {
      showPopup(errors[0], "error");
      return;
    }

    try {
      const formattedDOB = form.dob
        ? `${form.dob.split("-")[2]}/${form.dob.split("-")[1]}/${
            form.dob.split("-")[0]
          }`
        : "";
      console.log("Sending signup request", {
        ...form,
        dob: formattedDOB,
        role: "USER",
      }); // LOG 3
      const response = await AxiosInstance.post("/member/signup", {
        ...form,
        dob: formattedDOB,
        role: "USER",
      });

      const result = response.data.resultString;
      console.log("Signup result:", result); // LOG 4
      if (result.resultStatus === "0") {
        showPopup(result.result || "Signup failed", "error");
        console.log(result.result || "Signup failed");
      } else {
        showPopup(result.result || "Signup successful", "success");
        console.log(result.result || "Signup successful");
        // navigate("/login");
      }
    } catch (err) {
      console.error("Signup error:", err); // LOG 5
      showPopup("Signup failed. Please try again.", "error");
    }
  };

  return (
    <div className="su-page">
      <div className="su-container">
        <div className="su-brand-title">
          <img src={BrandLogo} alt="Brand Logo" className="su-brand-logo" />
        </div>
        <form onSubmit={handleSignup}>
          <h2 className="su-title">SIGNUP</h2>

          <div className="su-form">
            <label className="su-label">Name:</label>
            <input
              className="su-field"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
            />

            <label className="su-label">Email:</label>
            <input
              className="su-field"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
            />

            <label className="su-label">Password:</label>
            <input
              className="su-field"
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setShowPasswordRules(true)}
              onBlur={() => setShowPasswordRules(false)}
            />

            {showPasswordRules && (
              <div className="password-rules">
                <p className={form.password.length >= 8 ? "valid" : ""}>
                  • At least 8 characters
                </p>
                <p className={/[A-Z]/.test(form.password) ? "valid" : ""}>
                  • One uppercase letter
                </p>
                <p className={/\d/.test(form.password) ? "valid" : ""}>
                  • One number
                </p>
                <p className={/[@$!%*?&]/.test(form.password) ? "valid" : ""}>
                  • One special character (@$!%*?&)
                </p>
              </div>
            )}

            <label className="su-label">Date of Birth:</label>
            <input
              className="su-field su-date"
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="su-buttons">
            <button className="su-submit-button" type="submit">
              Signup
            </button>
            <button
              className="su-login-button"
              type="button"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSignup;
