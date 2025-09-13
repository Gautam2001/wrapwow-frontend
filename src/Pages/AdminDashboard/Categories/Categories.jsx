import React, { useCallback, useEffect, useState } from "react";
import "./Categories.css";
//import AxiosInstance from "../../../api/AxiosInstance";
import AdminHeader from "../../HeaderFooters/Admin/AdminHeader";
import AdminFooter from "../../HeaderFooters/Admin/AdminFooter";
import { FaArrowRight } from "react-icons/fa";
import CategoryPopup from "./CategoriesPopup";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { useLoading } from "../../GlobalFunctions/GlobalLoader/LoadingContext";
import Breadcrumbs from "../../GlobalFunctions/BackFunctionality/Breadcrumbs";
import { useApiClients } from "../../../api/useApiClients";

const Categories = () => {
  const { wrapwowApi } = useApiClients();
  const { showPopup } = usePopup;
  const { showLoader, hideLoader } = useLoading();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: "",
    category: "",
    image: null,
  });

  const fetchCategories = useCallback(async () => {
    showLoader();
    try {
      const response = await wrapwowApi.get("/member/getCategories");
      const result = response.data;
      if (result.status === "1") {
        showPopup(result.message, "error");
      } else {
        const data = result.Categories;
        if (Array.isArray(data)) {
          setCategories(data);
        }
      }
    } catch (err) {
      showPopup(
        err.response
          ? "Fetching categories failed. Please try again."
          : "An error occurred. Please check your connection.",
        "error"
      );
    } finally {
      hideLoader();
    }
  }, [showPopup]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handlePopup = (category) => {
    setSelectedCategory(category);
    if (category) {
      setFormData({
        categoryId: category.categoryId,
        category: category.category,
        image: null,
      });
    } else {
      setFormData({
        categoryId: "",
        category: "",
        image: null,
      });
    }
    setPopupOpen(true);
  };

  const handlePopupChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const AddCategory = async (e) => {
    e.preventDefault();

    const loginData = JSON.parse(sessionStorage.getItem("LoginData"));
    const email = loginData?.username;

    const formDataToSend = new FormData();

    try {
      let response = null;
      if (formData.categoryId) {
        formDataToSend.append("emailId", email);
        formDataToSend.append("categoryId", formData.categoryId);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("Image", formData.image);

        response = await wrapwowApi.post(
          "/admin/updateCategory",
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        formDataToSend.append("emailId", email);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("image", formData.image);

        response = await wrapwowApi.post("/admin/addCategory", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const result = response.data;
      if (result.status === "1") {
        setError(result.message);
      } else {
        setPopupOpen(false);
        setSelectedCategory(null);
        fetchCategories();
      }
    } catch {
      setError("Update category failed.");
    }
  };

  const UpdateCategoryStatus = async (e) => {
    e.preventDefault();

    const loginData = JSON.parse(sessionStorage.getItem("LoginData"));
    const email = loginData?.username;

    setError("");
    try {
      const response = await wrapwowApi.post("/admin/updateCategoryStatus", {
        email,
        id: selectedCategory.categoryId,
      });
      const result = response.data;

      if (result.status === "1") {
        setError(result.message);
      } else {
        setPopupOpen(false);
        setSelectedCategory(null);
        fetchCategories();
      }
    } catch (err) {
      setError(
        err.response
          ? "Updating user status failed, try again."
          : "An error occurred. Please check your connection."
      );
    }
  };

  const closePopup = () => {
    setPopupOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="cg-page">
      <AdminHeader />

      {error ? (
        <div className="cg-error"> {error}</div>
      ) : (
        <div className="cg-container">
          <Breadcrumbs
            labelMap={{
              "manage-categories": "Categories",
            }}
          />
          <div className="cg-cards">
            <div className="cg-add-category">
              <div className="cg-product-heading">
                <h2 className="cg-product-heading-title">New Category</h2>
                <p className="cg-product-heading-desc">
                  Want to add a new Category?
                </p>
              </div>
              <button
                onClick={() => handlePopup(null)}
                className="cg-product-button"
              >
                Click Here <FaArrowRight />
              </button>
            </div>

            {categories.map((category) => (
              <div
                className="cg-card"
                key={category.categoryId}
                onClick={() => handlePopup(category)}
              >
                <img
                  src={category.path}
                  alt={category.category}
                  className="cg-card-image"
                />
                <h4 className="cg-card-title">
                  {category.categoryStatus === "INACTIVE"
                    ? `${category.category} - INACTIVE`
                    : category.category}
                </h4>
              </div>
            ))}

            {/* Popup Component */}
            <CategoryPopup
              isOpen={popupOpen}
              onClose={closePopup}
              onSubmit={AddCategory}
              formData={formData}
              onChange={handlePopupChange}
              selectedCategory={selectedCategory}
              onStatusToggle={UpdateCategoryStatus}
            />
          </div>
        </div>
      )}
      <AdminFooter />
    </div>
  );
};

export default Categories;
