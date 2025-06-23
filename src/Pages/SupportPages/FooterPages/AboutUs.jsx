import React from "react";
import "./AboutUs.css";
import UserHeader from "../../HeaderFooters/User/UserHeader";
import UserFooter from "../../HeaderFooters/User/UserFooter";
import Breadcrumbs from "../../GlobalFunctions/BackFunctionality/Breadcrumbs";
import LandingHeader from "../../HeaderFooters/LandingPage/LandingHeader";
import LandingFooter from "../../HeaderFooters/LandingPage/LandingFooter";

const AboutUs = () => {
  const loginData = JSON.parse(sessionStorage.getItem("LoginData"));

  return (
    <div className="aboutus-page">
      {loginData ? <UserHeader /> : <LandingHeader />}

      <div className="aboutus-container">
        <Breadcrumbs
          labelMap={{
            about: "About Us",
          }}
        />
        <h1 className="aboutus-title">About Wrap & Wow</h1>
        <p className="aboutus-tagline">
          Where thoughtful gifting meets modern technology.
        </p>

        <section className="aboutus-section">
          <h2>🌟 What is Wrap & Wow?</h2>
          <p>
            <strong>Wrap & Wow</strong> is a curated gift card marketplace that
            makes thoughtful gifting effortless. Whether it’s birthdays,
            weddings, or corporate gestures, our platform lets users discover,
            customize, and share digital gift cards from top brands.
          </p>
        </section>

        <section className="aboutus-section">
          <h2>🎨 Design & Vision</h2>
          <p>
            Designed with a modern, clean, and intuitive UI, Wrap & Wow aims to
            make the user journey as smooth as possible. Inspired by minimalist
            aesthetics, we focused on:
          </p>
          <ul>
            <li>Smooth transitions and hover animations</li>
            <li>Mobile-first responsive layout</li>
            <li>Lightweight, readable design system</li>
          </ul>
        </section>

        <section className="aboutus-section">
          <h2>🚀 Key Features</h2>
          <ul>
            <li>
              🎁 Dynamic product management (add, edit, update, soft delete)
            </li>
            <li>🔐 Role-based access (admin, user)</li>
            <li>📈 Real-time analytics for admins (revenue, trends, users)</li>
            <li>📂 Image preview and upload with instant feedback</li>
            <li>🛒 Smart cart, order summary & checkout workflow</li>
            <li>📊 Graphs for revenue, user trends, and stock alerts</li>
            <li>💬 Global popup system for feedback and alerts</li>
            <li>🌐 Responsive design across all pages</li>
          </ul>
        </section>

        <section className="aboutus-section">
          <h2>🧠 Technologies Used</h2>
          <div className="aboutus-tech">
            <div>
              <h4>Frontend</h4>
              <ul>
                <li>⚛️ React (with Vite)</li>
                <li>🎨 Custom CSS (Modern Card UI + Responsive)</li>
                <li>📦 React Router</li>
                <li>📈 Chart.js (for analytics)</li>
              </ul>
            </div>
            <div>
              <h4>Backend</h4>
              <ul>
                <li>☕ Java Spring Boot (REST APIs)</li>
                <li>🗃️ MySQL (relational data model)</li>
                <li>🛠️ Spring Security (authentication)</li>
                <li>📸 Cloud storage for images</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="aboutus-section">
          <h2>🛠️ Behind the Build</h2>
          <p>
            <strong>Wrap & Wow</strong> was built as a comprehensive full-stack
            web application to demonstrate real-world skills in building secure,
            scalable, and visually appealing platforms from scratch.
          </p>

          <p>The project includes advanced backend capabilities such as:</p>
          <ul>
            <li>
              🔐 <strong>Token-based Authentication</strong> using JWT for
              secure and stateless login
            </li>
            <li>
              🔒 <strong>Role-based Authorization</strong> (Admin vs User)
              ensuring access control to critical operations
            </li>
            <li>
              🧩 <strong>Modular REST APIs</strong> built with Java Spring Boot
              for handling users, products, orders, categories, and analytics
            </li>
            <li>
              🗃️ <strong>Relational Database Design</strong> using MySQL with
              foreign keys and entity relationships (One-to-Many, Many-to-One)
            </li>
            <li>
              📊 <strong>Admin Analytics</strong> endpoints serving real-time
              data for revenue, stock, user trends, and category-level insights
            </li>
            <li>
              🖼️ <strong>File Upload Handling</strong> for images using
              multipart requests and secure storage
            </li>
            <li>
              🛡️ <strong>Spring Security</strong> integration to protect
              endpoints and filter unauthorized requests
            </li>
            <li>
              🧪 <strong>Input validation</strong> and custom error responses to
              ensure API integrity
            </li>
          </ul>

          <p>
            On the frontend, the application leverages React to offer a dynamic,
            intuitive, and mobile-responsive experience with features such as:
          </p>
          <ul>
            <li>
              ⚛️ <strong>Component-driven UI</strong> with reusable layouts,
              cards, and modals
            </li>
            <li>
              📈 <strong>Interactive dashboards</strong> using Chart.js for live
              data visualization
            </li>
            <li>
              🛍️ <strong>Product lifecycle management</strong> (add, edit,
              update, soft-delete)
            </li>
            <li>
              🖼️ <strong>Live image previews</strong> for product uploads
            </li>
            <li>
              🛒 <strong>Smart cart & checkout</strong> workflow with final
              price calculation
            </li>
            <li>
              📤 <strong>Global popup and loader system</strong> for user
              feedback and request tracking
            </li>
            <li>
              🎯 <strong>Form validations and feedback</strong> for better UX
              during signup, product creation, etc.
            </li>
            <li>
              🌐 <strong>React Router navigation</strong> with state transfer
              across pages
            </li>
          </ul>

          <p>
            Every component — from architecture to animation — was thoughtfully
            designed to simulate the experience of building a production-level
            e-commerce platform. The project strengthened my grasp of full-stack
            principles, API design, secure coding practices, and modern UI
            development.
          </p>
        </section>

        <section className="aboutus-section">
          <h2>📫 Want to Reach Out?</h2>
          <p>
            🚀 <strong>Wrap & Wow</strong> is a personal full-stack project
            crafted to showcase real-world development capabilities across
            frontend and backend. Whether you're a fellow developer, recruiter,
            or curious visitor — feel free to explore the platform!
            <br />
            📄 You can view my <strong>resume</strong> and other useful details
            by clicking
            <em> "Contact Developer"</em> in the footer below.
          </p>
        </section>
      </div>

      {loginData ? <UserFooter /> : <LandingFooter />}
    </div>
  );
};

export default AboutUs;
