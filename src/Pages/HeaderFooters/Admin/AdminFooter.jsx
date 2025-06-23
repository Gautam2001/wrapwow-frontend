import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaFileDownload,
} from "react-icons/fa";
import BrandLogo from "../../../Assets/GiftersLogoW.png";
import "./AdminFooter.css";
import { useNavigate } from "react-router-dom";

const AdminFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="af-page">
      <div className="af-container">
        <div className="af-brand">
          <p className="af-logo-text">Admin Dash • WRAP & WOW</p>
          <p className="af-tagline">Powering effortless gifting management</p>
          <p className="af-branding">Built by Gautam Singhal</p>
        </div>

        <div className="af-links">
          <a href="/contact" className="af-link">
            Contact Developer
          </a>
          <a href="/privacy" className="af-link">
            Privacy Policy
          </a>
          <a href="/terms" className="af-link">
            Terms & Conditions
          </a>
        </div>

        <div className="af-social">
          <img
            src={BrandLogo}
            alt="Brand Logo"
            className="af-logo-img"
            onClick={() => navigate("/admin-dashboard")}
          />
          <div className="af-social-icons">
            <a
              href="mailto:gautamsinghal206@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="af-icon-link"
            >
              <FaEnvelope size={16} />
            </a>
            <a
              href="https://github.com/Gautam2001"
              target="_blank"
              rel="noopener noreferrer"
              className="af-icon-link"
            >
              <FaGithub size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/gautam-singhal-b87813226/"
              target="_blank"
              rel="noopener noreferrer"
              className="af-icon-link"
            >
              <FaLinkedin size={16} />
            </a>
            <a
              href="https://drive.google.com/file/d/12H7y1snb15QF0t8YQLjJnmW4k-t-RPuC/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="af-icon-link"
              title="Download Resume"
            >
              <FaFileDownload size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="af-bottom-text">
        © {new Date().getFullYear()} Wrap & Wow. All rights reserved.
      </div>
    </footer>
  );
};

export default AdminFooter;
