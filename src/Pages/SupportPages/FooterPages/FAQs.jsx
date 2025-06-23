import React from "react";
import "./FAQs.css";
import UserHeader from "../../HeaderFooters/User/UserHeader";
import LandingHeader from "../../HeaderFooters/LandingPage/LandingHeader";
import UserFooter from "../../HeaderFooters/User/UserFooter";
import LandingFooter from "../../HeaderFooters/LandingPage/LandingFooter";
import Breadcrumbs from "../../GlobalFunctions/BackFunctionality/Breadcrumbs";

const FAQs = () => {
  const loginData = JSON.parse(sessionStorage.getItem("LoginData"));
  const faqList = [
    {
      question: "What is Wrap & Wow?",
      answer:
        "Wrap & Wow is a curated gift card platform designed to make digital gifting effortless, elegant, and personalized. From birthday surprises to corporate tokens, we’ve got you covered.",
    },
    {
      question: "Do I need an account to make a purchase?",
      answer:
        "Yes, creating an account allows us to securely store your order details, manage past purchases, and ensure a seamless checkout process.",
    },
    {
      question: "What technologies power Wrap & Wow?",
      answer:
        "Our platform uses React.js (Vite) for a fast frontend, Spring Boot for the backend, MySQL for data management, and Cloudinary for image hosting. We also use JWT-based authentication and role-based access.",
    },
    {
      question: "How can I contact support?",
      answer:
        "You can reach out to us via the 'Contact Developer' link in the footer. We’re here to help with any issues or questions you have.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. We use token-based authentication, encrypted data flows, and secure API practices to ensure your information remains private and safe.",
    },
    {
      question: "Are gift cards refundable?",
      answer:
        "Once a gift card is purchased and delivered, it cannot be refunded. Please double-check your selections before completing the transaction.",
    },
  ];

  return (
    <div className="faq-page">
      {loginData ? <UserHeader /> : <LandingHeader />}

      <div className="faq-container">
        <Breadcrumbs
          labelMap={{
            faq: "FAQs",
          }}
        />
        <h1 className="faq-title">❓ Frequently Asked Questions</h1>
        <p className="faq-subtitle">Got questions? We've got answers.</p>

        <div className="faq-list">
          {faqList.map((faq, index) => (
            <div key={index} className="faq-item">
              <h3 className="faq-question">Q: {faq.question}</h3>
              <p className="faq-answer">A: {faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {loginData ? <UserFooter /> : <LandingFooter />}
    </div>
  );
};

export default FAQs;
