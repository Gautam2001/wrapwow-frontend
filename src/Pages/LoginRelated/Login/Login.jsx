import React, { useEffect, useState } from "react";
import "./Login.css";
import BrandLogo from "../../../Assets/GiftersLogo.png";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../../api/AxiosInstance";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import CredentialsPopup from "./CredentialsPopup";

const Login = () => {
  const navigate = useNavigate();
  const { showPopup } = usePopup();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [credentialsPopup, setCredentialsPopup] = useState(false);

  const usercredentials = `Username: user@wrapwow.com
  Password: User@1234`;

  const admincredentials = `Username: admin@wrapwow.com
  Password: Admin@1234`;

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const HandleForgotPass = () => {
    navigate("/otp-verification");
  };

  const HandleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      showPopup("All fields are required.", "error");
      return;
    }

    try {
      const response = await AxiosInstance.post("/member/login", {
        email,
        password,
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
        sessionStorage.setItem("LoginData", JSON.stringify(result, null, 2));
        showPopup("Login successful!", "success");

        console.log("LoginData : " + JSON.stringify(result, null, 2));

        navigate(result.role === "ADMIN" ? "/admin-dashboard" : "/dashboard");
      }
    } catch (err) {
      if (err.response) {
        showPopup("Login failed. Please try again.", "error");
      } else {
        showPopup("An error occurred. Please check your connection.", "error");
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-brand-title">
          <img
            src={BrandLogo}
            alt="Gift Carders Logo"
            className="login-brand-logo"
          />
        </div>
        <form onSubmit={HandleLoginSubmit}>
          <h2 className="login-title">LOGIN</h2>

          <div className="login-form">
            <label className="login-label">Email Id: </label>
            <input
              className="login-field"
              type="email"
              name="email"
              placeholder="Enter your Email Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="login-label">Password: </label>
            <input
              className="login-field"
              type="password"
              name="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="login-buttons">
            <button className="login-submit-button" type="submit">
              Login
            </button>
            <button
              className="login-forgotpass-button"
              type="button"
              onClick={HandleForgotPass}
            >
              Forgot Password
            </button>
          </div>
          <div className="login-button">
            <button
              className="login-credential-button"
              type="button"
              onClick={() => setCredentialsPopup(true)}
            >
              Get Credentials
            </button>
          </div>
          {credentialsPopup && (
            <CredentialsPopup
              user={usercredentials}
              admin={admincredentials}
              onClose={() => setCredentialsPopup(false)}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
