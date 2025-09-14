import React from "react";
import { LoadingProvider } from "./Pages/GlobalFunctions/GlobalLoader/LoadingContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalPopupProvider } from "./Pages/GlobalFunctions/GlobalPopup/GlobalPopupContext";
import "./Pages/GlobalFunctions/GlobalPopup/GlobalPopup.css";

import ProtectedRoute from "./api/ProtectedRoute";

import Join from "./Pages/LoginRelated/Join/Join";
import Login from "./Pages/LoginRelated/Login/Login";
import ResetPassword from "./Pages/LoginRelated/ResetPassword/ResetPassword";
import ForgotPassword from "./Pages/LoginRelated/ForgotPassword/ForgotPassword";
import ChangePassword from "./Pages/LoginRelated/ForgotPassword/ChangePassword";
import RequestSignup from "./Pages/LoginRelated/Signup/RequestSignup";
import Signup from "./Pages/LoginRelated/Signup/Signup";

import UserDashboard from "./Pages/Dashboards/UserDashboard";
import ViewProducts from "./Pages/UserDashboard/ViewProducts/ViewProducts";
import DisplayProduct from "./Pages/UserDashboard/ViewSingleProduct/DisplayProduct";
import Cart from "./Pages/UserDashboard/CartCheckout/Cart";
import Checkout from "./Pages/UserDashboard/CartCheckout/Checkout";
import MyOrders from "./Pages/UserDashboard/MyOrders/MyOrders";

import AdminDashboard from "./Pages/Dashboards/AdminDashboard";
import ManageUser from "./Pages/AdminDashboard/ManageMembers/ManageUser";
import ManageAdmin from "./Pages/AdminDashboard/ManageMembers/ManageAdmin";
import ManageProducts from "./Pages/AdminDashboard/Product/ManageProducts";
import AddProduct from "./Pages/AdminDashboard/Product/AddProduct";
import ViewProduct from "./Pages/AdminDashboard/Product/UpdateProduct";
import Categories from "./Pages/AdminDashboard/Categories/Categories";

import LandingPage from "./Pages/SupportPages/LandingPage";
import ContactDeveloper from "./Pages/SupportPages/ContactDeveloper";
import AboutUs from "./Pages/SupportPages/FooterPages/AboutUs";
import PrivacyPolicy from "./Pages/SupportPages/FooterPages/PrivacyPolicy";
import TermsAndConditions from "./Pages/SupportPages/FooterPages/TermsAndConditions";
import FAQs from "./Pages/SupportPages/FooterPages/FAQs";

import Maintenance from "./Pages/Down/Maintenance";

const isMaintenance = import.meta.env.VITE_MAINTENANCE_MODE === "true";

const App = () => {
  if (isMaintenance) {
    return <Maintenance />;
  }

  return (
    <LoadingProvider>
      <GlobalPopupProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/join" element={<Join />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/signup" element={<RequestSignup />} />
            <Route path="/signup-otp" element={<Signup />} />

            <Route path="/contact" element={<ContactDeveloper />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/faq" element={<FAQs />} />

            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/manage-users" element={<ManageUser />} />
              <Route path="/manage-admins" element={<ManageAdmin />} />
              <Route path="/manage-products" element={<ManageProducts />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/update-product" element={<ViewProduct />} />
              <Route path="/manage-categories" element={<Categories />} />
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
