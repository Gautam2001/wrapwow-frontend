import React, { useState } from "react";
import {
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaFileDownload,
} from "react-icons/fa";
import "./ContactDeveloper.css";
import LandingHeader from "../HeaderFooters/LandingPage/LandingHeader";
import LandingFooter from "../HeaderFooters/LandingPage/LandingFooter";
import UserHeader from "../HeaderFooters/User/UserHeader";
import UserFooter from "../HeaderFooters/User/UserFooter";
import AdminHeader from "../HeaderFooters/Admin/AdminHeader";
import AdminFooter from "../HeaderFooters/Admin/AdminFooter";
import { usePopup } from "../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import AxiosInstance from "../../api/AxiosInstance";
import Breadcrumbs from "../GlobalFunctions/BackFunctionality/Breadcrumbs";

const ContactDeveloper = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});

  const { showPopup } = usePopup();

  const loginData = JSON.parse(sessionStorage.getItem("LoginData"));

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z ]{3,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(form.name.trim())) {
      newErrors.name = "Name must be at least 3 characters and only letters.";
    }

    if (!emailRegex.test(form.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (form.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters long.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const response = await AxiosInstance.post("/member/contactUs", {
        ...form,
      });

      const result = response.data.resultString;
      if (result.resultStatus === "0") {
        showPopup(result.result, "error");
      } else {
        showPopup("Thank you, for the Feedback!", "success");
      }
    } catch {
      showPopup("Failed to add product. Try again.", "error");
    }
    setForm({ name: "", email: "", message: "" });
    setErrors({});
  };

  const getHeader = () => {
    if (!loginData) return <LandingHeader />;
    if (loginData.role === "ADMIN") return <AdminHeader />;
    if (loginData.role === "USER") return <UserHeader />;
    return <LandingHeader />;
  };

  const getFooter = () => {
    if (!loginData) return <LandingFooter />;
    if (loginData.role === "ADMIN") return <AdminFooter />;
    if (loginData.role === "USER") return <UserFooter />;
    return <LandingFooter />;
  };

  return (
    <div className="cd-page">
      {getHeader()}
      <div className="cd-container">
        <Breadcrumbs
          labelMap={{
            contact: "Contact Us",
          }}
        />
        <div className="cd-sub-container">
          <div className="cd-left">
            <h2>Let's Connect 💬</h2>
            <p>
              Have questions, ideas, or feedback? I'm always open to
              conversations and collaborations. Use the form or reach me
              directly through these channels:
            </p>
            <div className="cd-socials">
              <a
                href="mailto:gautamsinghal206@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaEnvelope /> Email
              </a>
              <a
                href="https://www.linkedin.com/in/gautam-singhal-b87813226/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin /> LinkedIn
              </a>
              <a
                href="https://github.com/Gautam2001"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub /> GitHub
              </a>
              <a
                href="https://drive.google.com/file/d/12H7y1snb15QF0t8YQLjJnmW4k-t-RPuC/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                title="Download Resume"
              >
                <FaFileDownload /> Resume
              </a>
            </div>
          </div>

          <div className="cd-right">
            <form onSubmit={handleSubmit}>
              <h3>Contact Form</h3>

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? "error" : ""}
                required
              />
              {errors.name && <span className="cd-error">{errors.name}</span>}

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
                required
              />
              {errors.email && <span className="cd-error">{errors.email}</span>}

              <textarea
                name="message"
                rows="5"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                className={errors.message ? "error" : ""}
                required
              />
              {errors.message && (
                <span className="cd-error">{errors.message}</span>
              )}

              <button type="submit">Send Message</button>
            </form>
          </div>
        </div>
      </div>
      {getFooter()}
    </div>
  );
};

export default ContactDeveloper;
