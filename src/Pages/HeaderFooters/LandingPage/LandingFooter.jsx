import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaFileDownload,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BrandLogo from "../../../Assets/GiftersLogoW.png";
import "./LandingFooter.css";

const LandingFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="lf-page">
      <div className="lf-container">
        <div className="lf-brand">
          <p className="lf-logo-text">WRAP & WOW</p>
          <p className="lf-tagline">Your perfect gifts, just a click away</p>
          <p className="lf-branding">Built by Gautam Singhal</p>
        </div>

        <div className="lf-links">
          <a href="/contact" className="lf-link">
            Contact Developer
          </a>
          <a href="/about" className="lf-link">
            About Us
          </a>
          <a href="/faq" className="lf-link">
            FAQs
          </a>
        </div>

        <div className="lf-social">
          <img
            src={BrandLogo}
            alt="Brand Logo"
            className="lf-logo-img"
            onClick={() => navigate("/dashboard")}
          />
          <div className="lf-social-icons">
            <a
              href="mailto:singhal.gautam.gs@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="lf-icon-link"
            >
              <FaEnvelope size={16} />
            </a>
            <a
              href="https://github.com/Gautam2001"
              target="_blank"
              rel="noopener noreferrer"
              className="lf-icon-link"
            >
              <FaGithub size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/gautam-singhal-b87813226/"
              target="_blank"
              rel="noopener noreferrer"
              className="lf-icon-link"
            >
              <FaLinkedin size={16} />
            </a>
            <a
              href="https://drive.google.com/file/d/12H7y1snb15QF0t8YQLjJnmW4k-t-RPuC/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="lf-icon-link"
              title="Download Resume"
            >
              <FaFileDownload size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="lf-bottom-text">
        © {new Date().getFullYear()} Wrap & Wow. Crafted with love & purpose.
      </div>
    </footer>
  );
};

export default LandingFooter;
