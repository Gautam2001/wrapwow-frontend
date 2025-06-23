import React from "react";
import { LoadingProvider } from "./Pages/GlobalFunctions/GlobalLoader/LoadingContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalPopupProvider } from "./Pages/GlobalFunctions/GlobalPopup/GlobalPopupContext";
import "./Pages/GlobalFunctions/GlobalPopup/GlobalPopup.css";

import ProtectedRoute from "./api/ProtectedRoute";
import Login from "./Pages/LoginRelated/Login/Login";
import ForgotPass from "./Pages/LoginRelated/ForgotPassword/ForgotPass";
import UserDashboard from "./Pages/Dashboards/UserDashboard";
import AdminDashboard from "./Pages/Dashboards/AdminDashboard";
import OtpVerification from "./Pages/LoginRelated/ForgotPassword/OtpVerification";
import ManageUser from "./Pages/AdminDashboard/ManageMembers/ManageUser";
import ManageAdmin from "./Pages/AdminDashboard/ManageMembers/ManageAdmin";
import ManageProducts from "./Pages/AdminDashboard/Product/ManageProducts";
import AddProduct from "./Pages/AdminDashboard/Product/AddProduct";
import ViewProduct from "./Pages/AdminDashboard/Product/UpdateProduct";
import ViewProducts from "./Pages/UserDashboard/ViewProducts/ViewProducts";
import DisplayProduct from "./Pages/UserDashboard/ViewSingleProduct/DisplayProduct";
import Categories from "./Pages/AdminDashboard/Categories/Categories";
import LandingPage from "./Pages/SupportPages/LandingPage";
import Cart from "./Pages/UserDashboard/CartCheckout/Cart";
import Checkout from "./Pages/UserDashboard/CartCheckout/Checkout";
import MyOrders from "./Pages/UserDashboard/MyOrders/MyOrders";
import UserSignup from "./Pages/LoginRelated/Signup/UserSignup";
import AdminSignup from "./Pages/LoginRelated/Signup/AdminSignup";
import PrivacyPolicy from "./Pages/SupportPages/FooterPages/PrivacyPolicy";
import TermsAndConditions from "./Pages/SupportPages/FooterPages/TermsAndConditions";
import AboutUs from "./Pages/SupportPages/FooterPages/AboutUs";
import FAQs from "./Pages/SupportPages/FooterPages/FAQs";
import ContactDeveloper from "./Pages/SupportPages/ContactDeveloper";
import ResetPassword from "./Pages/LoginRelated/ResetPassword/ResetPassword";

const App = () => {
  return (
    <LoadingProvider>
      <GlobalPopupProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/otp-verification" element={<OtpVerification />} />
            <Route path="/forgot-password" element={<ForgotPass />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/signup" element={<UserSignup />} />
            <Route path="/admin-signup" element={<AdminSignup />} />

            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/faq" element={<FAQs />} />
            <Route path="/contact" element={<ContactDeveloper />} />

            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/manage-products" element={<ManageProducts />} />
              <Route path="/update-product" element={<ViewProduct />} />
              <Route path="/manage-categories" element={<Categories />} />
              <Route path="/manage-users" element={<ManageUser />} />
              <Route path="/manage-admins" element={<ManageAdmin />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/products" element={<ViewProducts />} />
              <Route path="/display-product" element={<DisplayProduct />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/my-orders" element={<MyOrders />} />
            </Route>
          </Routes>
        </Router>
      </GlobalPopupProvider>
    </LoadingProvider>
  );
};

export default App;
