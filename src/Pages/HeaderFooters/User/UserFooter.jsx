import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaFileDownload,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BrandLogo from "../../../Assets/GiftersLogoW.png";
import "./UserFooter.css";

const UserFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="uf-page">
      <div className="uf-container">
        <div className="uf-brand">
          <p className="uf-logo-text">WRAP & WOW</p>
          <p className="uf-tagline">Your perfect gifts, just a click away</p>
          <p className="uf-branding">Built by Gautam Singhal</p>
        </div>

        <div className="uf-links">
          <a href="/contact" className="uf-link">
            Contact Developer
          </a>
          <a href="/about" className="uf-link">
            About Us
          </a>
          <a href="/faq" className="uf-link">
            FAQs
          </a>
        </div>

        <div className="uf-social">
          <img
            src={BrandLogo}
            alt="Brand Logo"
            className="uf-logo-img"
            onClick={() => navigate("/dashboard")}
          />
          <div className="uf-social-icons">
            <a
              href="mailto:singhal.gautam.gs@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="uf-icon-link"
            >
              <FaEnvelope size={16} />
            </a>
            <a
              href="https://github.com/Gautam2001"
              target="_blank"
              rel="noopener noreferrer"
              className="uf-icon-link"
            >
              <FaGithub size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/gautam-singhal-b87813226/"
              target="_blank"
              rel="noopener noreferrer"
              className="uf-icon-link"
            >
              <FaLinkedin size={16} />
            </a>
            <a
              href="https://drive.google.com/file/d/12H7y1snb15QF0t8YQLjJnmW4k-t-RPuC/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="uf-icon-link"
              title="Download Resume"
            >
              <FaFileDownload size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="uf-bottom-text">
        © {new Date().getFullYear()} Wrap & Wow. Crafted with love & purpose.
      </div>
    </footer>
  );
};

export default UserFooter;
