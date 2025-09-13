import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../HeaderFooters/Admin/AdminHeader";
import AdminFooter from "../../HeaderFooters/Admin/AdminFooter";
import "./AddProduct.css";
//import AxiosInstance from "../../../api/AxiosInstance";
import ProductPreviewModal from "./ProductPreviewModal";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { useLoading } from "../../GlobalFunctions/GlobalLoader/LoadingContext";
import Breadcrumbs from "../../GlobalFunctions/BackFunctionality/Breadcrumbs";
import { useApiClients } from "../../../api/useApiClients";

const AddProduct = () => {
  const navigate = useNavigate();
  const { wrapwowApi } = useApiClients();
  const { showPopup } = usePopup();
  const { showLoader, hideLoader } = useLoading();
  const [categories, setCategories] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: "",
    category: "",
    categoryId: "",
    status: "",
    prices: [{ price: "", discount: "0", finalPrice: "0" }],
    images: [],
  });
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    showLoader();
    const fetchCategories = async () => {
      try {
        const response = await wrapwowApi.get("/member/getCategoryNames");
        const result = response.data;

        if (result.status === "1") {
          showPopup(result.message, "error");
        } else {
          const data = result.Categories;
          if (Array.isArray(data)) setCategories(data);
        }
      } catch {
        showPopup("Failed to fetch categories.", "error");
      } finally {
        hideLoader();
      }
    };
    fetchCategories();
  }, [showPopup]);

  const calculateFinalPrice = (price, discount) => {
    const p = parseFloat(price) || 0;
    const d = parseFloat(discount) || 0;
    return (p - (p * d) / 100).toFixed(2);
  };

  const handlePriceChange = (index, field, value) => {
    const updatedPrices = [...formData.prices];
    updatedPrices[index][field] = value;

    const price = updatedPrices[index].price;
    const discount = updatedPrices[index].discount;
    updatedPrices[index].finalPrice = calculateFinalPrice(price, discount);

    setFormData((prev) => ({
      ...prev,
      prices: updatedPrices,
    }));
  };

  const addPriceRow = () => {
    if (formData.prices.length < 5) {
      setFormData((prev) => ({
        ...prev,
        prices: [...prev.prices, { price: "", discount: "0", finalPrice: "0" }],
      }));
    }
  };

  const removePriceRow = (index) => {
    const updatedPrices = formData.prices.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      prices: updatedPrices,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    const selected = categories.find(
      (c) => c.categoryId === parseInt(selectedId)
    );
    setFormData((prev) => ({
      ...prev,
      categoryId: selectedId,
      category: selected?.category || "",
    }));
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setFormData((prev) => ({
      ...prev,
      status: status,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileURLs = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...fileURLs],
    }));
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.title.trim()) return "Title is required.";
    if (!formData.description.trim()) return "Description is required.";
    if (!formData.categoryId) return "Select a Category.";
    if (!formData.status) return "Select a Status.";
    if (!formData.quantity || parseInt(formData.quantity) <= 0)
      return "Enter valid quantity.";
    if (selectedFiles.length === 0) return "At least one image is required.";

    for (let i = 0; i < formData.prices.length; i++) {
      const { price, discount } = formData.prices[i];
      if (!price || parseFloat(price) <= 0)
        return `Price at row ${i + 1} is invalid.`;
      if (discount < 0 || discount > 100)
        return `Discount at row ${i + 1} is invalid.`;
    }

    return "";
  };

  const prepareProductPreviewData = () => {
    const loginData = JSON.parse(sessionStorage.getItem("LoginData"));
    const email = loginData?.username;

    const priceList = formData.prices.map((p) => parseFloat(p.price));
    const discountList = formData.prices.map((p) => parseFloat(p.discount));
    const finalPriceList = formData.prices.map((p) => parseFloat(p.finalPrice));

    return {
      email,
      name: formData.title,
      description: formData.description,
      category: formData.category,
      categoryId: formData.categoryId,
      productStatus: formData.status,
      quantity: parseInt(formData.quantity),
      prices: formData.prices,
      images: formData.images.map((path, index) => ({
        imageId: index + 1,
        path,
      })),
      priceList,
      discountList,
      finalPriceList,
      selectedFiles,
    };
  };

  const HandleAddProduct = async () => {
    showLoader();
    const product = previewData;
    const {
      email,
      name,
      description,
      category,
      priceList,
      discountList,
      finalPriceList,
      productStatus,
      quantity,
      selectedFiles,
    } = product;

    try {
      const response = await wrapwowApi.post("/admin/addProduct", {
        email,
        name,
        description,
        category,
        price: priceList,
        discount: discountList,
        finalPrice: finalPriceList,
        productStatus,
        quantity,
      });

      const result = response.data;
      if (result.status === "1") {
        showPopup(result.message, "error");
      } else {
        const productId = result.productId;
        await HandleImageAPI(productId, selectedFiles);
      }
    } catch {
      showPopup("Failed to add product. Try again.", "error");
    }
  };

  const HandleImageAPI = async (productId, files) => {
    const formDataToSend = new FormData();
    formDataToSend.append("productId", productId);
    files.forEach((file) => formDataToSend.append("Images", file));

    try {
      const response = await wrapwowApi.post(
        "/admin/uploadImage",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const result = response.data;
      if (result.status === "1") {
        showPopup(result.message, "error");
      } else {
        showPopup("Product added Successfully.", "success");
        hideLoader();
        navigate("/admin-dashboard");
      }
    } catch {
      showPopup("Image upload failed.", "error");
    }
  };

  return (
    <div className="ap-page">
      <AdminHeader />
      <div className="ap-container">
        <Breadcrumbs
          labelMap={{
            "add-product": "New Product",
          }}
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const validationError = validateForm();
            if (validationError) {
              showPopup(validationError, "error");
              return;
            }

            const prepared = prepareProductPreviewData();
            setPreviewData(prepared);
            setShowPreview(true);
          }}
        >
          <h1 className="ap-title">ADD PRODUCT</h1>
          <div className="ap-form">
            <div className="ap-product-desc">
              <label className="ap-label">Title:</label>
              <input
                className="ap-field"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
              <label className="ap-label">Description:</label>
              <textarea
                className="ap-field"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
              <label className="ap-label">Category:</label>
              <select
                className="ap-field"
                value={formData.categoryId}
                onChange={handleCategoryChange}
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryStatus === "INACTIVE"
                      ? `${cat.category} - INACTIVE`
                      : cat.category}
                  </option>
                ))}
              </select>

              {formData.prices.map((row, index) => (
                <div className="ap-input-groups" key={index}>
                  <div className="ap-input-group">
                    <label className="ap-label">Price:</label>
                    <input
                      className="ap-field"
                      type="number"
                      value={row.price}
                      onChange={(e) =>
                        handlePriceChange(index, "price", e.target.value)
                      }
                    />
                  </div>
                  <div className="ap-input-group">
                    <label className="ap-label">Discount (%):</label>
                    <input
                      className="ap-field"
                      type="number"
                      value={row.discount}
                      onChange={(e) =>
                        handlePriceChange(index, "discount", e.target.value)
                      }
                    />
                  </div>
                  <div className="ap-input-group">
                    <label className="ap-label">Final Price:</label>
                    <input
                      className="ap-field"
                      value={row.finalPrice}
                      disabled
                    />
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      className="ap-remove-btn"
                      onClick={() => removePriceRow(index)}
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}

              {formData.prices.length < 5 && (
                <button
                  type="button"
                  className="ap-add-more-btn"
                  onClick={addPriceRow}
                >
                  + Add More Price
                </button>
              )}

              <div className="ap-input-groups">
                <div className="ap-input-group">
                  <label className="ap-label">Status: </label>
                  <select
                    className="ap-field"
                    name="status"
                    value={formData.status}
                    onChange={handleStatusChange}
                  >
                    <option value="">-- Select Status --</option>
                    <option key="ACTIVE" value="ACTIVE">
                      Active
                    </option>
                    <option key="INACTIVE" value="INACTIVE">
                      Inactive
                    </option>
                  </select>
                </div>
                <div className="ap-input-group">
                  <label className="ap-label">Available Quantity:</label>
                  <input
                    className="ap-field"
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="ap-product-img">
              <label className="ap-label">Add Images:</label>
              <div
                className="ap-image-upload-box"
                onClick={() => document.getElementById("imageInput").click()}
              >
                <span className="ap-image-upload-text">+ Add Image</span>
                <input
                  id="imageInput"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </div>
              <div className="ap-image-preview-container">
                {formData.images.map((image, index) => (
                  <div key={index} className="ap-image-preview">
                    <img src={image} alt={`preview-${index}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="ap-image-remove"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="ap-buttons">
            <button className="ap-submit-button" type="submit">
              Submit
            </button>
          </div>
        </form>

        {showPreview && previewData && (
          <ProductPreviewModal
            product={previewData}
            onClose={() => setShowPreview(false)}
            onConfirm={HandleAddProduct}
          />
        )}
      </div>
      <AdminFooter />
    </div>
  );
};

export default AddProduct;
