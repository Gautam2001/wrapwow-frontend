import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminHeader from "../../HeaderFooters/Admin/AdminHeader";
import AdminFooter from "../../HeaderFooters/Admin/AdminFooter";
import "./UpdateProduct.css";
import AxiosInstance from "../../../api/AxiosInstance";
import ProductPreviewModal from "./ProductPreviewModal";
import { usePopup } from "../../GlobalFunctions/GlobalPopup/GlobalPopupContext";
import { useLoading } from "../../GlobalFunctions/GlobalLoader/LoadingContext";
import Breadcrumbs from "../../GlobalFunctions/BackFunctionality/Breadcrumbs";

const UpdateProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.state?.productId;
  const { showPopup } = usePopup();
  const { showLoader, hideLoader } = useLoading();
  const [categories, setCategories] = useState([]);
  const [addedImages, setAddedImages] = useState([]);
  const [initialImages, setInitialImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    quantity: "",
    category: "",
    categoryId: "",
    status: "",
    prices: [{ price: "", discount: "0", finalPrice: "0" }],
    images: [],
    orderedQty: "",
    updatedBy: "",
    createdAt: "",
    updatedAt: "",
  });
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      showLoader();
      try {
        const categoryRes = await AxiosInstance.get("/member/getCategoryNames");
        const categoryResult = categoryRes.data.resultString;

        if (categoryResult.resultStatus === "0") {
          showPopup(categoryResult.result, "error");
          return;
        }

        const categoryData = categoryResult.Categories;
        if (!Array.isArray(categoryData)) {
          showPopup("Invalid category data", "error");
          return;
        }

        setCategories(categoryData);

        const productRes = await AxiosInstance.get(
          "/admin/getProductById?productId=" + productId
        );
        const productResult = productRes.data.resultString;

        if (productResult.resultStatus === "0") {
          showPopup(productResult.result, "error");
          return;
        }

        const productData = productResult.Product;

        const matchedCategory = categoryData.find(
          (c) => c.category === productData.category
        );
        const categoryId = matchedCategory ? matchedCategory.categoryId : "";

        const updatedDate = new Date(productData.updatedAt)
          .toLocaleString("sv-SE")
          .replace(" ", "T")
          .replace("T", " ");
        const createdDate = new Date(productData.createdAt)
          .toLocaleString("sv-SE")
          .replace(" ", "T")
          .replace("T", " ");

        setInitialImages(productData.images);

        setFormData({
          id: productData.productId || "",
          title: productData.name || "",
          description: productData.description || "",
          quantity: productData.availableQty || "",
          category: productData.category || "",
          categoryId: categoryId || "",
          status: productData.productStatus || "",
          prices: productData.prices.map((p) => ({
            price: p.price,
            discount: p.discount,
            finalPrice: p.finalPrice,
          })),
          images: productData.images || [],
          orderedQty: productData.totalOrderedQty,
          updatedBy: productData.updatedBy,
          createdAt: createdDate,
          updatedAt: updatedDate,
        });
      } catch {
        showPopup("Failed to load data.", "error");
      } finally {
        hideLoader();
      }
    };

    fetchData();
  }, [productId, showPopup]);

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
    setAddedImages((prevFiles) => [...prevFiles, ...files]);
  };

  const removeImage = (index) => {
    const imageToRemove = formData.images[index];

    if (typeof imageToRemove === "object" && imageToRemove.path) {
      const found = initialImages.find(
        (img) => img.imageId === imageToRemove.imageId
      );
      if (found) {
        setDeletedImages((prev) => [...prev, found.imageId]);
      }
    }

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    if (typeof imageToRemove === "string") {
      setAddedImages((prevFiles) => prevFiles.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) return "Title is required.";
    if (!formData.description.trim()) return "Description is required.";
    if (!formData.categoryId) return "Select a Category.";
    if (!formData.status) return "Select a Status.";
    if (!formData.quantity || parseInt(formData.quantity) <= 0)
      return "Enter valid quantity.";
    if (formData.images.length === 0) return "At least one image is required.";

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
    const email = loginData?.email;

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
      images: formData.images.map((path, index) => {
        if (typeof path === "string") {
          return { imageId: index + 1, path };
        } else {
          return { imageId: path.imageId, path: path.path };
        }
      }),
      priceList,
      discountList,
      finalPriceList,
      selectedFiles: addedImages,
      productId: formData.id,
      isUpdate: true,
    };
  };

  const HandleUpdateProduct = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      showPopup(validationError, "error");
      return;
    }

    const loginData = JSON.parse(sessionStorage.getItem("LoginData"));
    const email = loginData?.email;

    const priceList = formData.prices.map((p) => parseFloat(p.price));
    const discountList = formData.prices.map((p) => parseFloat(p.discount));
    const finalPriceList = formData.prices.map((p) => parseFloat(p.finalPrice));

    try {
      const response = await AxiosInstance.post("/admin/updateProduct", {
        email,
        productId: formData.id,
        name: formData.title,
        description: formData.description,
        category: formData.category,
        price: priceList,
        discount: discountList,
        finalPrice: finalPriceList,
        productStatus: formData.status,
        quantity: formData.quantity,
      });

      const result = response.data.resultString;
      if (result.resultStatus === "0") {
        showPopup(result.result, "error");
      } else {
        const productId = result.productId;
        if (addedImages.length === 0 && deletedImages.length === 0) {
          navigate("/manage-products");
        } else {
          HandleImageAPI(productId);
        }
      }
    } catch {
      showPopup("Failed to update product. Try again.", "error");
    }
  };

  const HandleImageAPI = async (productId) => {
    const formDataToSend = new FormData();
    formDataToSend.append("productId", productId);
    addedImages.forEach((image) => formDataToSend.append("Images", image));
    deletedImages.forEach((imageId) =>
      formDataToSend.append("imageIds", imageId)
    );

    try {
      const response = await AxiosInstance.post(
        "/admin/updateProductImage",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const result = response.data.resultString;
      if (result.resultStatus === "0") {
        showPopup(result.result, "error");
      } else {
        showPopup("Product updated successfully", "success");
        navigate("/manage-products");
      }
    } catch {
      showPopup("Image upload failed.", "error");
    }
  };

  return (
    <div className="up-page">
      <AdminHeader />
      <div className="up-container">
        <Breadcrumbs
          labelMap={{
            "update-product": "Update Product #" + productId,
          }}
          extraPaths={[{ label: "Products", path: "/manage-products" }]}
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
          <h1 className="up-title">PRODUCT DESCRIPTION</h1>
          <div className="up-form">
            <div className="up-product-desc">
              <label className="up-label">Title:</label>
              <input
                className="up-field"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
              <label className="up-label">Description:</label>
              <textarea
                className="up-field"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
              <label className="up-label">Category:</label>
              <select
                className="up-field"
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
                <div className="up-input-groups" key={index}>
                  <div className="up-input-group">
                    <label className="up-label">Price:</label>
                    <input
                      className="up-field"
                      type="number"
                      value={row.price}
                      onChange={(e) =>
                        handlePriceChange(index, "price", e.target.value)
                      }
                    />
                  </div>
                  <div className="up-input-group">
                    <label className="up-label">Discount (%):</label>
                    <input
                      className="up-field"
                      type="number"
                      value={row.discount}
                      onChange={(e) =>
                        handlePriceChange(index, "discount", e.target.value)
                      }
                    />
                  </div>
                  <div className="up-input-group">
                    <label className="up-label">Final Price:</label>
                    <input
                      className="up-field"
                      value={row.finalPrice}
                      disabled
                    />
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      className="up-remove-btn"
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
                  className="up-add-more-btn"
                  onClick={addPriceRow}
                >
                  + Add More Price
                </button>
              )}

              <div className="up-input-groups">
                <div className="up-input-group">
                  <label className="up-label">Status: </label>
                  <select
                    className="up-field"
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
                <div className="up-input-group">
                  <label className="up-label">Available Quantity:</label>
                  <input
                    className="up-field"
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="up-input-groups">
                <div className="up-input-group">
                  <label className="up-label">Total Ordered Quantity:</label>
                  <input
                    className="up-field"
                    value={formData.orderedQty}
                    disabled
                  />
                </div>
                <div className="up-input-group">
                  <label className="up-label">Last Updated By:</label>
                  <input
                    className="up-field"
                    value={formData.updatedBy}
                    disabled
                  />
                </div>
              </div>
              <div className="up-input-groups">
                <div className="up-input-group">
                  <label className="up-label">Last Updated On:</label>
                  <input
                    className="up-field"
                    value={formData.updatedAt}
                    disabled
                  />
                </div>
                <div className="up-input-group">
                  <label className="up-label">Product Created On:</label>
                  <input
                    className="up-field"
                    value={formData.createdAt}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="up-product-img">
              <label className="up-label">Add Images:</label>
              <div
                className="up-image-upload-box"
                onClick={() => document.getElementById("imageInput").click()}
              >
                <span className="up-image-upload-text">+ Add Image</span>
                <input
                  id="imageInput"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </div>
              <div className="up-image-preview-container">
                {formData.images.map((image, index) => (
                  <div key={index} className="up-image-preview">
                    <img
                      src={typeof image === "string" ? image : image.path}
                      alt={`preview-${index}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="up-image-remove"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="up-buttons">
            <button className="up-submit-button" type="submit">
              Submit
            </button>
          </div>
        </form>
        {showPreview && previewData && (
          <ProductPreviewModal
            product={previewData}
            onClose={() => setShowPreview(false)}
            onConfirm={() => {
              setShowPreview(false);
              HandleUpdateProduct(new Event("submit"));
            }}
          />
        )}
      </div>
      <AdminFooter />
    </div>
  );
};

export default UpdateProduct;
