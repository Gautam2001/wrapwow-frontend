import React from "react";
import "./TermsAndConditions.css";
import AdminHeader from "../../HeaderFooters/Admin/AdminHeader";
import AdminFooter from "../../HeaderFooters/Admin/AdminFooter";
import Breadcrumbs from "../../GlobalFunctions/BackFunctionality/Breadcrumbs";

const TermsAndConditions = () => {
  return (
    <div className="tc-page">
      <AdminHeader />
      <div className="tc-container">
        <Breadcrumbs
          labelMap={{
            terms: "Terms & Conditions",
          }}
        />
        <h1 className="tc-title">Terms & Conditions</h1>
        <p className="tc-update">Last Updated: June 2025</p>

        <section className="tc-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using the Wrap & Wow platform, you agree to comply
            with and be bound by the following terms and conditions. If you do
            not agree, please refrain from using the platform.
          </p>
        </section>

        <section className="tc-section">
          <h2>2. Use of the Website</h2>
          <p>
            You agree to use the website only for lawful purposes and in a
            manner that does not infringe the rights of, or restrict or inhibit
            the use and enjoyment of the site by any third party.
          </p>
        </section>

        <section className="tc-section">
          <h2>3. Account Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            login credentials and for all activities that occur under your
            account.
          </p>
        </section>

        <section className="tc-section">
          <h2>4. Product Listings</h2>
          <p>
            All product details, prices, and availability are subject to change
            without notice. We reserve the right to modify or discontinue any
            service without prior notification.
          </p>
        </section>

        <section className="tc-section">
          <h2>5. Intellectual Property</h2>
          <p>
            All content on the site, including logos, text, images, and
            software, is the property of Wrap & Wow or its licensors and is
            protected by copyright and trademark laws.
          </p>
        </section>

        <section className="tc-section">
          <h2>6. Limitation of Liability</h2>
          <p>
            Wrap & Wow shall not be liable for any direct, indirect, or
            consequential damages resulting from the use or inability to use the
            platform.
          </p>
        </section>

        <section className="tc-section">
          <h2>7. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account if you
            violate any of these terms and conditions.
          </p>
        </section>

        <section className="tc-section">
          <h2>8. Changes to Terms</h2>
          <p>
            We may revise these terms and conditions at any time without notice.
            Continued use of the site constitutes acceptance of those changes.
          </p>
        </section>

        <section className="tc-section">
          <h2>9. Contact Information</h2>
          <p>
            If you have any questions regarding these terms, please contact us
            at{" "}
            <a href="mailto:singhal.gautam.gs@gmail.com">support@wrapwow.com</a>
            .
          </p>
        </section>
      </div>

      <AdminFooter />
    </div>
  );
};

export default TermsAndConditions;
