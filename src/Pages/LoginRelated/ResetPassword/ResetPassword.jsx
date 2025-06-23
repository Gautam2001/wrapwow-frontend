import React, { useState } from "react";
import "./ResetPassword.css";
import AdminHeader from "../../HeaderFooters/Admin/AdminHeader";
import UserHeader from "../../HeaderFooters/User/UserHeader";
import AdminFooter from "../../HeaderFooters/Admin/AdminFooter";
import UserFooter from "../../HeaderFooters/User/UserFooter";
import Breadcrumbs from "../../GlobalFunctions/BackFunctionality/Breadcrumbs";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import AxiosInstance from "../../../api/AxiosInstance";

const ResetPassword = () => {
  const { showPopup } = usePopup();
  const loginData = JSON.parse(sessionStorage.getItem("LoginData"));
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    const { currentPassword, newPassword, confirmPassword } = form;

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required.";
    }

    if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword =
        "New password must be 8+ characters with at least 1 uppercase letter, 1 number, and 1 special character.";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const email = loginData?.email;
      const response = await AxiosInstance.post("/member/resetPassword", {
        email,
        oldPassword: form.currentPassword,
        password: form.confirmPassword,
      });

      const result = response.data.resultString;
      if (result.resultStatus === "0") {
        showPopup(result.result, "error");
      } else {
        showPopup("Thank you, for the Feedback!", "success");
      }
    } catch {
      showPopup("Failed to Change the password. Please try again.", "error");
    }

    showPopup("Password changed successfully!");
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const HeaderComponent = loginData.role === "ADMIN" ? AdminHeader : UserHeader;

  const FooterComponent = loginData.role === "ADMIN" ? AdminFooter : UserFooter;

  return (
    <div className="rp-page">
      <HeaderComponent />
      <div className="rp-container">
        <Breadcrumbs
          labelMap={{
            "reset-password": "Reset Password",
          }}
        />
        <h2>🔐 Reset Password</h2>
        <form onSubmit={handleSubmit} className="rp-form">
          <div className="rp-form-group">
            <label>Email</label>
            <input
              type="email"
              value={loginData?.email || ""}
              readOnly
              className="readonly"
            />
          </div>

          <div className="rp-form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
            />
            {errors.currentPassword && (
              <span className="rp-error">{errors.currentPassword}</span>
            )}
          </div>

          <div className="rp-form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
            />
            {errors.newPassword && (
              <span className="rp-error">{errors.newPassword}</span>
            )}
          </div>

          <div className="rp-form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <span className="rp-error">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="rp-button">
            Update Password
          </button>
        </form>
      </div>
      <FooterComponent />
    </div>
  );
};

export default ResetPassword;
