import React, { useEffect, useState } from "react";
import "./Login.css";
import BrandLogo from "../../../Assets/GiftersLogo.png";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import CredentialsPopup from "./CredentialsPopup";
import { useApiClients } from "../../../api/useApiClients";

const Login = () => {
  const navigate = useNavigate();
  const { loginApi, wrapwowApi } = useApiClients();
  const { showPopup } = usePopup();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  // const HandleForgotPass = () => {
  //   navigate("/otp-verification");
  // };

  const HandleLoginSubmit = async (e) => {
    try {
      e.preventDefault();
    } catch (err) {
      console.error("preventDefault failed", err);
      return;
    }

    if (!email.trim() || !password.trim()) {
      showPopup("All fields are required.", "error");
      return;
    }

    setStatus("loading");

    try {
      const res = await wrapwowApi.post("/member/exists", {
        email,
      });
      const data = res.data;

      if (data.status === "0") {
        //continue to login
        const loginRes = await loginApi.post("/auth/login", {
          username: email,
          password,
        });
        const loginData = {
          ...res.data,
          ...loginRes.data,
        };

        if (loginData.status === "0") {
          showPopup(loginData.message || "Login successful!", "success");
          sessionStorage.setItem(
            "LoginData",
            JSON.stringify(loginData, null, 2)
          );
          console.log("LoginData : " + sessionStorage.getItem("LoginData"));
          navigate(
            loginData.role === "ADMIN" ? "/admin-dashboard" : "/dashboard"
          );
        } else {
          showPopup(loginData.message || "Something went wrong.", "error"); //proceed  for signup
        }
      } else {
        //user does not exists in wrap-wow table
        showPopup(data.message || "Something went wrong.", "error"); //proceed for join
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Network error. Please try again later.";
      showPopup(message, "error");
    } finally {
      setStatus("");
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
            <button
              className="login-submit-button"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Logging In..." : "Login"}
            </button>
            {/* <button
              className="login-forgotpass-button"
              type="button"
              onClick={HandleForgotPass}
            >
              Forgot Password
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
