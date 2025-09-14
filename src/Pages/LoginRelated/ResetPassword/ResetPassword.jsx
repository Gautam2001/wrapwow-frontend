import React, { useState } from "react";
import "./ResetPassword.css";
import AdminHeader from "../../HeaderFooters/Admin/AdminHeader";
import UserHeader from "../../HeaderFooters/User/UserHeader";
import AdminFooter from "../../HeaderFooters/Admin/AdminFooter";
import UserFooter from "../../HeaderFooters/User/UserFooter";
import Breadcrumbs from "../../GlobalFunctions/BackFunctionality/Breadcrumbs";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { useApiClients } from "../../../api/useApiClients";
import { useNavigate } from "react-router-dom";
//import AxiosInstance from "../../../api/AxiosInstance";

const ResetPassword = () => {
  const loginData = JSON.parse(sessionStorage.getItem("LoginData"));
  const username = loginData?.username || "User";
  const navigate = useNavigate();
  const { loginApi } = useApiClients();
  const { showPopup } = usePopup();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1 = verify old password, Step 2 = new password
  const [otp, setOtp] = useState(null);

  // Step 1: Verify old password
  const handleVerifyOldPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    const oldPassword = e.target.oldPassword.value;

    try {
      const res = await loginApi.post("/auth/request-reset-password", {
        username,
        password: oldPassword,
      });

      if (res.data.status === "0") {
        setOtp(res.data.otpToken); // backend must return this
        showPopup("Old password verified. Enter new password.", "success");
        setStep(2);
      } else {
        showPopup(res.data.message || "Invalid old password", "error");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Network error while verifying password.";
      showPopup(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    // Validate strength
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      showPopup(
        "Password must be at least 8 chars, include uppercase, lowercase, number, and special char.",
        "error"
      );
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      showPopup("Passwords do not match", "error");
      setLoading(false);
      return;
    }

    try {
      const res = await loginApi.post("/auth/reset-password", {
        username,
        newPassword,
        otpToken: otp,
      });

      if (res.data.status === "0") {
        showPopup("Password reset successfully", "success");
        if (loginData.role === "ADMIN") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        showPopup(res.data.message || "Failed to reset password", "error");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Network error while resetting password.";
      showPopup(msg, "error");
    } finally {
      setLoading(false);
    }
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
        <div>
          <div className="rp-form">
            <label>Email</label>
            <input
              type="email"
              value={loginData?.username || ""}
              readOnly
              className="rp-input"
            />
          </div>
          {step === 1 && (
            <form className="rp-form" onSubmit={handleVerifyOldPassword}>
              <label>Old Password</label>
              <input
                type="password"
                name="oldPassword"
                placeholder="Enter Old Password"
                required
                className="rp-input"
              />
              <div className="rp-actions">
                <button type="submit" className="rp-button" disabled={loading}>
                  {loading ? "Verifying..." : "Next"}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form className="rp-form" onSubmit={handleResetPassword}>
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                required
                className="rp-input"
              />
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                required
                className="rp-input"
              />
              <div className="rp-actions">
                <button type="submit" className="rp-button" disabled={loading}>
                  {loading ? "Resetting..." : "Submit"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default ResetPassword;
