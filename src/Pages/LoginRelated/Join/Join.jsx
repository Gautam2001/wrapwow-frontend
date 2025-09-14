import React, { useEffect, useState } from "react";
import "./Join.css";
import BrandLogo from "../../../Assets/GiftersLogo.png";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { useNavigate } from "react-router-dom";
import { useApiClients } from "../../../api/useApiClients";

const Join = () => {
  const navigate = useNavigate();
  const { showPopup } = usePopup();
  const { wrapwowApi } = useApiClients();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      const res = await wrapwowApi.post("/member/join", {
        email,
      });
      const data = res.data;

      if (data.status === "0") {
        showPopup(data.message || "Joined successfully!", "success"); //proceed for login
        navigate("/login");
      } else if (data.status === "1") {
        showPopup(
          data.message || "User does not exist, please Signup!",
          "error"
        ); //proceed for signup
        navigate("/signup");
      } else {
        showPopup(data.message || "Something went wrong.", "error");
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
    <div className="join-page">
      <div className="join-container">
        <div className="join-brand-title">
          <img
            src={BrandLogo}
            alt="Gift Carders Logo"
            className="join-brand-logo"
          />
          <p>A GIFTING RETREAT</p>
        </div>

        <form onSubmit={handleJoin}>
          <h2 className="join-title">JOIN</h2>

          <div className="join-form">
            <label className="join-label">Email Id:</label>
            <input
              className="join-field"
              type="email"
              name="email"
              placeholder="Enter your Email Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            className="join-button"
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Joining..." : "Join Now"}
          </button>
        </form>

        <div className="join-footer">
          <p>
            Already a member? <a href="/login">Log in here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Join;
