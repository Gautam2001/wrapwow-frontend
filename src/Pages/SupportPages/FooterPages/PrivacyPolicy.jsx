import React from "react";
import "./PrivacyPolicy.css";
import AdminHeader from "../../HeaderFooters/Admin/AdminHeader";
import AdminFooter from "../../HeaderFooters/Admin/AdminFooter";
import Breadcrumbs from "../../GlobalFunctions/BackFunctionality/Breadcrumbs";

const PrivacyPolicy = () => {
  return (
    <div className="pp-page">
      <AdminHeader />
      <div className="pp-container">
        <Breadcrumbs
          labelMap={{
            privacy: "Privacy Policy",
          }}
        />
        <h1 className="pp-title">Privacy Policy</h1>

        <p className="pp-update">Last Updated: June 2025</p>

        <section className="pp-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Wrap & Wow. This Privacy Policy describes how we collect,
            use, and protect your information when you use our platform.
          </p>
        </section>

        <section className="pp-section">
          <h2>2. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul>
            <li>Personal details such as name, email, and date of birth</li>
            <li>Account credentials and login activity</li>
            <li>Order history and saved preferences</li>
            <li>Technical information like IP address and browser type</li>
          </ul>
        </section>

        <section className="pp-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Process orders and transactions</li>
            <li>Improve the user experience</li>
            <li>Maintain account security</li>
            <li>Send alerts, offers, and updates</li>
          </ul>
        </section>

        <section className="pp-section">
          <h2>4. Data Protection</h2>
          <p>
            We follow industry-standard security practices to safeguard your
            data. Access to your information is restricted to authorized
            personnel only.
          </p>
        </section>

        <section className="pp-section">
          <h2>5. Cookies</h2>
          <p>
            We use cookies to enhance your experience, track usage, and store
            preferences. You can modify cookie settings in your browser.
          </p>
        </section>

        <section className="pp-section">
          <h2>6. Third-Party Services</h2>
          <p>
            We do not share your personal data with third-party marketers.
            However, we may use services like payment gateways or analytics
            tools that have their own policies.
          </p>
        </section>

        <section className="pp-section">
          <h2>7. Your Choices</h2>
          <p>
            You may review, update, or delete your personal information by
            contacting our support team. We respect your privacy rights.
          </p>
        </section>

        <section className="pp-section">
          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any major
            changes will be notified via email or platform notice.
          </p>
        </section>

        <section className="pp-section">
          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this policy, please contact us at:{" "}
            <a href="mailto:gautamsinghal206@gmail.com">support@wrapwow.com</a>
          </p>
        </section>
      </div>

      <AdminFooter />
    </div>
  );
};

export default PrivacyPolicy;
